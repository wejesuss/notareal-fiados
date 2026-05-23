from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.routes import clients, purchases
from app.database import init_database

app = FastAPI()

origins = [
    "http://localhost:9000",
    "http://127.0.0.1:9000",
    "http://192.168.18.8:9000",
]  # Quasar dev

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(clients.router)
app.include_router(purchases.router)


@app.on_event("startup")
def startup_event():
    init_database()


@app.get("/")
def get_home():
    return {"message": "Hello World"}
