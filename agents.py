# agents.py
import re
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

# 1. Parser Agent
def parser_agent(user):
    # Normalize data
    user["name"] = user["name"].title()
    user["skills"] = [s.strip().capitalize() for s in user["skills"]]
    return user

# 2. Role Analyzer Agent (dummy version)
def role_analyzer_agent(user, job_description=""):
    # Extract keywords (very simple for now)
    jd_keywords = re.findall(r"\\b[A-Za-z]+\\b", job_description)
    match = [s for s in user["skills"] if s.lower() in [k.lower() for k in jd_keywords]]
    return {"jd_keywords": jd_keywords, "matched_skills": match}

# 3. Template Selector Agent
def template_selector_agent(role="tech"):
    return "resume.html"

# 4. Personalization Agent (dummy LLM version)
def personalization_agent(user, jd_analysis):
    if jd_analysis["matched_skills"]:
        user["summary"] = f"Experienced professional skilled in {', '.join(jd_analysis['matched_skills'])}."
    else:
        user["summary"] = "Passionate learner with adaptable skills."
    return user

# 5. Formatter Agent
def formatter_agent(user, template_file):
    env = Environment(loader=FileSystemLoader("templates"))
    template = env.get_template(template_file)
    html_out = template.render(user=user)
    pdf_file = f"{user['name'].replace(' ', '_')}_resume.pdf"
    HTML(string=html_out).write_pdf(pdf_file)
    return pdf_file

# 6. ATS Agent (dummy scoring)
def ats_agent(user, jd_analysis):
    score = len(jd_analysis["matched_skills"]) * 10
    return {"ats_score": score}

# 7. Export Agent
def export_agent(pdf_path):
    return {"resume_path": pdf_path}
