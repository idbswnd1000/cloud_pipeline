import base64
import json

from fastapi import UploadFile
from openai import AsyncOpenAI

from app.config import settings
from app.imageRag.schema import ImageRagResponse
from app.storage.s3 import s3_storage


class ImageRagService:

    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.openai_api_key
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

        # S3 images/ 아래 음식 폴더 목록
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

        # S3 폴더 매칭
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
            matched_folder=matched_folder,
            images=images,
        )

    def _get_food_names(self) -> list[str]:
        """
        S3
        admin-s3-pipe/images/
        아래 음식 폴더 목록 조회
        """

        return s3_storage.list_folders()

    def _find_folder(
        self,
        food_name: str,
    ) -> str | None:

        folders = self._get_food_names()

        # 정확히 일치
        if food_name in folders:
            return food_name

        # 부분 일치
        for folder in folders:
            if (
                food_name in folder
                or folder in food_name
            ):
                return folder

        return None

    def _get_images(
        self,
        folder_name: str,
    ) -> list[str]:

        allowed_extensions = {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
        }

        # ex:
        # images/갈비구이/1.jpg
        # images/갈비구이/2.jpg
        files = s3_storage.list_files(
            folder_name
        )

        images = []

        for key in files:

            extension = (
                "." + key.rsplit(".", 1)[-1].lower()
                if "." in key
                else ""
            )

            if extension not in allowed_extensions:
                continue

            # s3.py의 _build_key가 images/를 다시 붙이기 때문에
            # images/ 부분 제거
            relative_path = key

            prefix = (
                settings.s3_image_prefix
                .strip("/")
                + "/"
            )

            if relative_path.startswith(prefix):
                relative_path = relative_path[
                    len(prefix):
                ]

            url = s3_storage.get_presigned_url(
                relative_path
            )

            images.append(url)

        return images[:10]


image_rag_service = ImageRagService()