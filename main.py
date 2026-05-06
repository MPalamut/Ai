from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests 
app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/models")
def models():
    url = "http://localhost:1234/v1/models"
    response = requests.get(url)
    return response.json()

@app.post("/responses")
def responses(input: str, selectedModel: str, previousResponse: str= None, ):
    url = "http://localhost:1234/v1/responses"
    headers = { "Content-Type": "application/json" }
    data = {
    "model": selectedModel,
    "input":  input,
}
    if previousResponse:
        data["previous_response_id"] = previousResponse
    response = requests.post(url,  headers= headers, json=data)
    return response.json()