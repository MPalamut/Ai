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
def responses(payload: dict):
    input_text = payload.get("input")
    selected_model = payload.get("selectedModel")
    previous_response = payload.get("previousResponse")
    image = payload.get("image")
    
    headers = { "Content-Type": "application/json" }
    
    if image:
        url = "http://localhost:1234/v1/chat/completions"
        data = {
            "model": selected_model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": input_text},
                        {"type": "image_url", "image_url": {"url": image}}
                    ]
                }
            ]
        }
        
        try:
            response = requests.post(url, headers=headers, json=data)
            lm_data = response.json()
            
            if "choices" in lm_data:
                text_content = lm_data["choices"][0]["message"]["content"]
                tokens = lm_data.get("usage", {}).get("completion_tokens", 0)
                res_id = lm_data.get("id", "")
                
                return {
                    "id": res_id,
                    "usage": {"output_tokens": tokens},
                    "output": [{"content": [{"text": text_content}]}]
                }
            return lm_data
            
        except Exception as e:
            return e
            
    else:
        url = "http://localhost:1234/v1/responses"
        data = {
            "model": selected_model,
            "input": input_text,
        }
        if previous_response:
            data["previous_response_id"] = previous_response

        try:
            response = requests.post(url, headers=headers, json=data)
            lm_data = response.json()
            
            if "choices" in lm_data:
                text_content = lm_data["choices"][0]["message"]["content"]
                tokens = lm_data.get("usage", {}).get("completion_tokens", 0)
                res_id = lm_data.get("id", "")
                return {
                    "id": res_id,
                    "usage": {"output_tokens": tokens},
                    "output": [{"content": [{"text": text_content}]}]
                }
                
            return lm_data
        except Exception as e:
            return {e}