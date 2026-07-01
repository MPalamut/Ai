from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import httpx
from pypdf import PdfReader
import base64
import io
from docx import Document
import os
import json
from datetime import datetime

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
    "*"
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
    url = "http://172.16.16.106:1234/v1/models"
    response = requests.get(url)
    return response.json()

@app.post("/responses")
async def responses(payload: dict):
    url = "http://172.16.16.106:1234/v1/responses"
    headers = {"Content-Type": "application/json"}
    selected_model = payload.get("selectedModel")
    input_text = payload.get("input")
    temperature = payload.get("temperature")
    previous_response = payload.get("previousResponse")
    file = payload.get("file")
    image = payload.get("image")

    if file:
        extracted_text = ""
        doc_type_label = ""
        docx = file.startswith("data:application/vnd.openxmlformats-officedocument.wordprocessingml.document")

        if "," in file:
            file = file.split(",")[1]
        file_bytes = base64.b64decode(file)
        file_stream = io.BytesIO(file_bytes)
        
        if docx:
            doc_type_label = "Word"
            doc = Document(file_stream)
            for para in doc.paragraphs:
                if para.text:
                    extracted_text += para.text + "\n"
                
            for table in doc.tables:
                for row in table.rows:
                    row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_text:
                        extracted_text += "\n" + "\t".join(row_text) + "\n"

            max_chars = 11000
            if len(extracted_text) > max_chars:
                extracted_text = extracted_text[:max_chars]
                
        else:
            doc_type_label = "PDF"
            reader = PdfReader(file_stream)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"

        max_chars = 12000
        if len(extracted_text) > max_chars:
            extracted_text = extracted_text[:max_chars]
        
        data = {
            "model": selected_model,
            "input": 
            [
                {
                    "role": "user",
                    "content": 
                    [
                        { 
                            "type": "input_text", 
                            "text": input_text 
                        },
                        { 
                            "type": "input_text",
                            "text": extracted_text
                        }
                    ]
                }
            ]
        }

        if previous_response:
            data["previous_response_id"] = previous_response

        response = requests.post(url, headers=headers, json=data)
        return response.json()
    
    if image:
        data = {
            "model": selected_model,
            "input": 
            [
                {
                    "role": "user",
                    "content": 
                    [
                        { 
                            "type": "input_text", 
                            "text": input_text 
                        },
                        { 
                            "type": "input_image",
                            "image_url": image
                        }
                    ]
                }
            ]
        }
        
        if previous_response:
            data["previous_response_id"] = previous_response

        response = requests.post(url, headers=headers, json=data)
        return response.json()

    else:
        data = {
            "model": selected_model,
            "input": 
            [
                {
                    "role": "user",
                    "content": 
                    [
                        { 
                            "type": "input_text", 
                            "text": input_text 
                        }
                    ]
                }
            ],
            "temperature": temperature
        }

        if previous_response:
            data["previous_response_id"] = previous_response
        
        response = requests.post(url, headers=headers, json=data)
        return response.json()
   
@app.post("/report")
async def report(payload: dict):
    report_text = payload.get("reportText")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file = os.path.join(current_dir, "reports.json")
    
    report_entry = {
        "timestamp": timestamp,
        "report": report_text
    }

    if os.path.exists(file):
        with open(file, "r") as f:
            reports_data = json.load(f)
    else:
        reports_data = []

    reports_data.append(report_entry)

    with open(file, "w") as f:
        json.dump(reports_data, f, indent=4)

    return {"message": "Report received", "report": report_entry}

    return {"message": "This is a test endpoint"}