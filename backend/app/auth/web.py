import jwt

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.schema import (
    AccessTokenResponse,
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    SignupRequest,
    TokenResponse,
    UserResponse,
)
from app.auth.security import decode_token
from app.auth.service import auth_service
from app.database import get_db
from app.models.user import User


router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"],
)


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:

    token = credentials.credentials

    try:
        payload = decode_token(token)

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access Token이 만료되었습니다.",
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 Access Token입니다.",
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access Token이 아닙니다.",
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="잘못된 Access Token입니다.",
        )

    user = await db.get(
        User,
        int(user_id),
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자를 찾을 수 없습니다.",
        )

    return user


@router.post(
    "/signup",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def signup(
    data: SignupRequest,
    db: AsyncSession = Depends(get_db),
):
    return await auth_service.signup(
        data=data,
        db=db,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    return await auth_service.login(
        data=data,
        db=db,
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
async def me(
    user: User = Depends(get_current_user),
):
    return user


@router.post(
    "/refresh",
    response_model=AccessTokenResponse,
)
async def refresh(
    data: RefreshRequest,
):
    return await auth_service.refresh(
        refresh_token=data.refresh_token
    )


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def logout(
    data: LogoutRequest,
):
    await auth_service.logout(
        refresh_token=data.refresh_token
    )