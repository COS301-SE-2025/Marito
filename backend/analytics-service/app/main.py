from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mavito_common.core.config import settings
from app.api.v1.endpoints import analytics

app = FastAPI(title="Marito Analytics Service")

if settings.BACKEND_CORS_ORIGINS_LIST:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS_LIST],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])


@app.get("/", tags=["Health Check"])
async def read_root():
    return {"service": "Marito Analytics Service", "status": "ok"}
