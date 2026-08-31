from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.web import router as auth_router
from app.database import Base, engine
from app.imageRag.web import router as image_rag_router

# 반드시 모델 import
import app.models


@asynccontextmanager
async def lifespan(app: FastAPI):

    async with engine.begin() as conn:
        await conn.run_sync(
            Base.metadata.create_all
        )

    yield

    await engine.dispose()


app = FastAPI(
    title="Pipeline API",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    auth_router
)

app.include_router(
    image_rag_router
)