from fastapi import FastAPI
from app.api.routes.schema import router as schema_router
from app.api.routes.user_req import router as user_req_router

from contextlib import asynccontextmanager
from app.cache.redis_cache import get_redis_client

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions (if any)
    yield
    # Shutdown actions
    client = get_redis_client()
    if client:
        print("🧹 Clearing Redis DB on shutdown...")
        client.flushdb()
        print("✅ Redis DB cleared.")

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DataSage", version="1.0", lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(schema_router)
app.include_router(user_req_router)