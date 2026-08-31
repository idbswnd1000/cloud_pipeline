from fastapi import (
    APIRouter,
    File,
    UploadFile,
)

from app.imageRag.schema import ImageRagResponse
from app.imageRag.service import image_rag_service


router = APIRouter(
    prefix="/api/image-rag",
    tags=["Image RAG"],
)


@router.post(
    "/analyze",
    response_model=ImageRagResponse,
)
async def analyze_image(
    file: UploadFile = File(...),
):
    return await image_rag_service.analyze_image(
        file=file
    )