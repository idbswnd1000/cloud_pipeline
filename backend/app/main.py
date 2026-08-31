from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.imageRag.web import router as image_rag_router


app = FastAPI(
    title="Image RAG API",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    image_rag_router
)


IMAGE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
    / "images"
)


app.mount(
    "/images",
    StaticFiles(
        directory=IMAGE_DIR
    ),
    name="images",
)