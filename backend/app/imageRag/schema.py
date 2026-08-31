from pydantic import BaseModel, Field


class ImageRagResponse(BaseModel):
    food_name: str = Field(description="분석된 음식 이름")
    description: str = Field(description="음식에 대한 설명")
    matched_folder: str | None = Field(
        default=None,
        description="매칭된 이미지 폴더 이름",
    )
    images: list[str] = Field(
        default_factory=list,
        description="검색된 이미지 URL 목록",
    )