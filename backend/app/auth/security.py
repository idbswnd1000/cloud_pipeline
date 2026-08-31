from datetime import datetime, timedelta, timezone
from uuid import uuid4

import jwt
from pwdlib import PasswordHash

from app.config import settings


password_hash = PasswordHash.recommended()


def hash_password(
    password: str,
) -> str:
    return password_hash.hash(password)


def verify_password(
    password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        password,
        hashed_password,
    )


def create_access_token(
    user_id: int,
) -> str:

    now = datetime.now(timezone.utc)

    expire = now + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def create_refresh_token(
    user_id: int,
) -> tuple[str, str]:

    now = datetime.now(timezone.utc)

    expire = now + timedelta(
        days=settings.refresh_token_expire_days
    )

    jti = str(uuid4())

    payload = {
        "sub": str(user_id),
        "type": "refresh",
        "jti": jti,
        "iat": now,
        "exp": expire,
    }

    token = jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )

    return token, jti


def decode_token(
    token: str,
) -> dict:

    return jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[
            settings.jwt_algorithm
        ],
    )