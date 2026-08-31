from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.schema import (
    LoginRequest,
    SignupRequest,
)
from app.auth.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.config import settings
from app.models.user import User
from app.redis_client import redis_client


class AuthService:

    async def signup(
        self,
        data: SignupRequest,
        db: AsyncSession,
    ) -> User:

        result = await db.execute(
            select(User).where(
                User.email == data.email
            )
        )

        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="이미 가입된 이메일입니다.",
            )

        user = User(
            email=data.email,
            name=data.name,
            password_hash=hash_password(
                data.password
            ),
        )

        db.add(user)

        await db.commit()
        await db.refresh(user)

        return user

    async def login(
        self,
        data: LoginRequest,
        db: AsyncSession,
    ) -> dict:

        result = await db.execute(
            select(User).where(
                User.email == data.email
            )
        )

        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="이메일 또는 비밀번호가 올바르지 않습니다.",
            )

        if not verify_password(
            data.password,
            user.password_hash,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="이메일 또는 비밀번호가 올바르지 않습니다.",
            )

        access_token = create_access_token(
            user.id
        )

        refresh_token, jti = (
            create_refresh_token(
                user.id
            )
        )

        ttl = (
            settings.refresh_token_expire_days
            * 24
            * 60
            * 60
        )

        await redis_client.setex(
            f"refresh:{jti}",
            ttl,
            str(user.id),
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    async def refresh(
        self,
        refresh_token: str,
    ) -> dict:

        try:
            payload = decode_token(
                refresh_token
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않은 Refresh Token입니다.",
            )

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh Token이 아닙니다.",
            )

        user_id = payload.get("sub")
        jti = payload.get("jti")

        if not user_id or not jti:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="잘못된 Refresh Token입니다.",
            )

        redis_user_id = (
            await redis_client.get(
                f"refresh:{jti}"
            )
        )

        if not redis_user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="만료되었거나 로그아웃된 토큰입니다.",
            )

        access_token = (
            create_access_token(
                int(user_id)
            )
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
        }

    async def logout(
        self,
        refresh_token: str,
    ) -> None:

        try:
            payload = decode_token(
                refresh_token
            )
        except Exception:
            return

        jti = payload.get("jti")

        if jti:
            await redis_client.delete(
                f"refresh:{jti}"
            )


auth_service = AuthService()