from fastapi import FastAPI, APIRouter
from routes import clients
from database import init_database

app = FastAPI()

app.include_router(clients.router)

@app.on_event("startup")
def startup_event():
    init_database()

@app.get("/")
def get_home():
    return {"message": "Hello World"}