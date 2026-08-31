import base64
import json
from pathlib import Path

from fastapi import UploadFile
from openai import AsyncOpenAI

from app.config import settings
from app.imageRag.schema import ImageRagResponse


class ImageRagService:

    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.openai_api_key
        )

        self.image_root = (
            Path(__file__)
            .resolve()
            .parents[2]
            / "images"
        )

    async def analyze_image(
        self,
        file: UploadFile,
    ) -> ImageRagResponse:

        image_bytes = await file.read()

        encoded_image = base64.b64encode(
            image_bytes
        ).decode("utf-8")

        content_type = (
            file.content_type
            or "image/jpeg"
        )

        food_names = self._get_food_names()

        response = await self.client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {
                    "role": "system",
                    "content": f"""
너는 한국 음식 이미지를 분석하는 AI야.

현재 데이터베이스에는 다음 음식 종류가 있어.

{", ".join(food_names)}

사용자가 보내는 음식 이미지를 보고
위 목록 중 가장 가까운 음식 하나를 선택해.

반드시 다음 JSON 형식으로만 응답해.

{{
    "food_name": "음식 이름",
    "description": "이 음식이라고 판단한 간단한 이유"
}}

food_name은 가능한 경우 반드시
제공된 음식 목록 안에서 선택해.
""",
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": (
                                "이 이미지의 음식이 무엇인지 "
                                "분석해줘."
                            ),
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": (
                                    f"data:{content_type};"
                                    f"base64,{encoded_image}"
                                )
                            },
                        },
                    ],
                },
            ],
            response_format={
                "type": "json_object"
            },
        )

        result_text = (
            response
            .choices[0]
            .message
            .content
        )

        result = json.loads(
            result_text or "{}"
        )

        food_name = result.get(
            "food_name",
            "알 수 없음",
        )

        description = result.get(
            "description",
            "",
        )

        matched_folder = self._find_folder(
            food_name
        )

        images = []

        if matched_folder:
            images = self._get_images(
                matched_folder
            )

        return ImageRagResponse(
            food_name=food_name,
            description=description,
            matched_folder=(
                matched_folder.name
                if matched_folder
                else None
            ),
            images=images,
        )

    def _get_food_names(self) -> list[str]:

        if not self.image_root.exists():
            return []

        return [
            folder.name
            for folder in self.image_root.iterdir()
            if folder.is_dir()
        ]

    def _find_folder(
        self,
        food_name: str,
    ) -> Path | None:

        if not self.image_root.exists():
            return None

        exact_folder = (
            self.image_root / food_name
        )

        if exact_folder.is_dir():
            return exact_folder

        for folder in self.image_root.iterdir():

            if not folder.is_dir():
                continue

            if (
                food_name in folder.name
                or folder.name in food_name
            ):
                return folder

        return None

    def _get_images(
        self,
        folder: Path,
    ) -> list[str]:

        allowed_extensions = {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
        }

        images = []

        for file in folder.iterdir():

            if (
                file.is_file()
                and file.suffix.lower()
                in allowed_extensions
            ):
                images.append(
                    f"/images/"
                    f"{folder.name}/"
                    f"{file.name}"
                )

        return images[:10]


image_rag_service = ImageRagService()