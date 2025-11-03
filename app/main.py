from fastapi import FastAPI, APIRouter
from routes import clients, purchases, payments
from database import init_database

app = FastAPI()

app.include_router(clients.router)
app.include_router(purchases.router)
app.include_router(payments.router)

@app.on_event("startup")
def startup_event():
    init_database()

@app.get("/")
def get_home():
    return {"message": "Hello World"}