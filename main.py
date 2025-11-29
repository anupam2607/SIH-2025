from fastapi import FastAPI
from pymongo import MongoClient
import os
from agents import (
    parser_agent, role_analyzer_agent, template_selector_agent,
    personalization_agent, formatter_agent, ats_agent, export_agent
)

app = FastAPI()

# MongoDB Atlas Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://Anupam:Anupam123@resumeapp.mmh1mei.mongodb.net/")
client = MongoClient(MONGO_URI)
db = client["resume_app"]

@app.get("/generate_resume/{user_name}")
def generate_resume(user_name: str, job_description: str = "Python SQL Developer"):
    user = db.users.find_one({"name": user_name})
    if not user:
        return {"error": "User not found"}

    # Run agents step by step
    user = parser_agent(user)
    jd_analysis = role_analyzer_agent(user, job_description)
    template_file = template_selector_agent("tech")
    user = personalization_agent(user, jd_analysis)
    pdf_path = formatter_agent(user, template_file)
    ats_result = ats_agent(user, jd_analysis)
    export_info = export_agent(pdf_path)

    return {
        "message": "Resume generated successfully",
        "ats_score": ats_result,
        "resume_file": export_info
    }
