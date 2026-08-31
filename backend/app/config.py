from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):

    # OpenAI
    openai_api_key: str
    openai_model: str = "gpt-4o-mini"

    # AWS
    aws_region: str = "ap-northeast-2"

    # S3
    s3_bucket_name: str = "admin-s3-pipe"
    s3_image_prefix: str = "images"

    # PostgreSQL
    database_url: str

    # Redis
    redis_url: str

    # JWT
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"

    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()