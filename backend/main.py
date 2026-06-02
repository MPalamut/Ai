from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import requests
from pypdf import PdfReader
import base64
import io

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
    url = "http://localhost:1234/v1/chat/completions"
    input_text = payload.get("input")
    selected_model = payload.get("selectedModel")
    previous_response = payload.get("previousResponse")
    file = payload.get("file")
    image = payload.get("image")
    headers = { "Content-Type": "application/json" }
    
    if file:
        try:
            if "," in file:
                file = file.split(",")[1]
            
            pdf_bytes = base64.b64decode(file)
            pdf_stream = io.BytesIO(pdf_bytes)
            reader = PdfReader(pdf_stream)
            pdf_text = ""
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    pdf_text += text + "\n"
            
            max_chars = 12000 
            if len(pdf_text) > max_chars:
                pdf_text = pdf_text[:max_chars]
   
            combined_prompt = f"{input_text}\n\nKontext aus dem PDF-Dokument:\n{pdf_text}"
            data = {
                "model": selected_model,
                "messages": [
                    {
                        "role": "user",
                        "content": combined_prompt
                    }
                ]
            }
            
            response = requests.post(url, headers=headers, json=data)
            lm_data = response.json()
            text_content = lm_data["choices"][0]["message"]["content"]
            tokens = lm_data.get("usage", {}).get("completion_tokens", 0)
            res_id = lm_data.get("id", "")
            
            return {
                "id": res_id,
                "usage": {"output_tokens": tokens},
                "output": [{"content": [{"text": text_content}]}]
            }

        except Exception as e:
            return {"error": f"Fehler bei der PDF-Verarbeitung: {str(e)}"}
       
    if image:
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
            text_content = lm_data["choices"][0]["message"]["content"]
            tokens = lm_data.get("usage", {}).get("completion_tokens", 0)
            res_id = lm_data.get("id", "")
            return {
                "id": res_id,
                "usage": {"output_tokens": tokens},
                "output": [{"content": [{"text": text_content}]}]
            }

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

        response = requests.post(url, headers=headers, json=data)
        return response.json()