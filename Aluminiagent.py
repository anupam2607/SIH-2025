# Alumni Agent demo (offline, TF-IDF + ranking)
import pandas as pd
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import textwrap
import os

DATA_PATH = r"D:\sih 2025\alumni_dataset.csv"

def safe_lower(x):
    return "" if pd.isna(x) else str(x).lower()

def preprocess_profile(row):
    parts = [
        safe_lower(row.get("job_titles", "")),
        safe_lower(row.get("skills", "")),
        safe_lower(row.get("degree", "")),
        safe_lower(row.get("higher_studies", "")),
        safe_lower(row.get("companies", "")),
        safe_lower(row.get("achievements", "")),
        safe_lower(row.get("certifications", ""))
    ]
    return " . ".join([p for p in parts if p])

def parse_timeline(job_titles):
    if pd.isna(job_titles) or str(job_titles).strip() == "":
        return []
    items = re.split(r"->|→", job_titles)
    timeline = [it.strip() for it in items if it.strip()]
    return timeline

def education_score(higher_studies_text):
    text = safe_lower(higher_studies_text)
    score = 0.0
    if "phd" in text:
        score = 1.0
    elif "ms" in text or "m.s" in text or "m.tech" in text:
        score = 0.85
    elif "mba" in text:
        score = 0.6
    else:
        if any(inst in text for inst in ["iit", "mit", "stanford", "oxford", "cambridge"]):
            score = max(score, 0.75)
    return score

def achievement_score(achievements_text):
    text = safe_lower(achievements_text)
    score = 0.0
    if "kaggle gold" in text or "kaggle grandmaster" in text:
        score += 0.9
    if "kaggle silver" in text:
        score += 0.6
    if "kaggle bronze" in text:
        score += 0.4
    if "hackathon winner" in text:
        score += 0.6
    if "research" in text or "paper" in text or "published" in text:
        score += 0.7
    if "patent" in text:
        score += 0.7
    return min(score, 1.0)

PRESTIGE_MAP = {
    "google": 1.0, "microsoft": 0.95, "facebook": 0.95, "meta": 0.95, "amazon": 0.9,
    "apple": 0.9, "ibm": 0.7, "tcs": 0.5, "infosys": 0.4, "wipro": 0.4, "flipkart": 0.7,
    "deloitte": 0.6, "accenture": 0.55, "capgemini": 0.5, "mckinsey": 0.9, "bain":0.9
}

def company_score(companies_text):
    text = safe_lower(companies_text)
    score = 0.0
    for name, val in PRESTIGE_MAP.items():
        if name in text:
            score = max(score, val)
    return score

class AlumniAgent:
    def __init__(self, csv_path=DATA_PATH):
        assert os.path.exists(csv_path), f"CSV not found at {csv_path}"
        self.df = pd.read_csv(csv_path)
        self.df["profile_text"] = self.df.apply(preprocess_profile, axis=1)
        self.vectorizer = TfidfVectorizer(ngram_range=(1,2), stop_words="english", max_features=5000)
        self.profile_matrix = self.vectorizer.fit_transform(self.df["profile_text"].values.astype('U'))
        self.df["edu_score"] = self.df["higher_studies"].apply(education_score)
        self.df["ach_score"] = self.df["achievements"].apply(achievement_score)
        self.df["comp_score"] = self.df["companies"].apply(company_score)
        self.df["timeline"] = self.df["job_titles"].apply(parse_timeline)
        print(f"Loaded {len(self.df)} alumni profiles.")

    def query(self, text_query, top_n=5, explain=False):
        q = safe_lower(text_query)
        q_vec = self.vectorizer.transform([q])
        sims = cosine_similarity(q_vec, self.profile_matrix).flatten()
        combined = 0.6 * sims + 0.15 * self.df["edu_score"].values + 0.15 * self.df["ach_score"].values + 0.1 * self.df["comp_score"].values
        ranked_idx = np.argsort(-combined)[:top_n]
        results = []
        for idx in ranked_idx:
            row = self.df.iloc[idx].to_dict()
            result = {
                "id": int(row["id"]) if not pd.isna(row["id"]) else None,
                "name": row.get("name"),
                "dept": row.get("dept"),
                "grad_year": row.get("grad_year"),
                "current_companies": row.get("companies"),
                "skills": row.get("skills"),
                "higher_studies": row.get("higher_studies"),
                "achievements": row.get("achievements"),
                "linkedin": row.get("linkedin_url"),
                "timeline": row.get("timeline"),
                "text_similarity": float(sims[idx]),
                "edu_score": float(row.get("edu_score", 0.0)),
                "ach_score": float(row.get("ach_score", 0.0)),
                "comp_score": float(row.get("comp_score", 0.0)),
                "combined_score": float(combined[idx])
            }
            if explain:
                result["profile_text"] = row.get("profile_text")
            results.append(result)
        return results

    def generate_guidance(self, student_profile, alumni_result):
        steps = []
        alumni_skills = [s.strip().lower() for s in str(alumni_result.get("skills","")).split(",") if s.strip()]
        if len(alumni_skills) > 0:
            steps.append(f"Study and practice these key skills demonstrated by alumni: {', '.join(alumni_skills[:6])}.")
        hs = alumni_result.get("higher_studies","")
        if pd.notna(hs) and str(hs).strip().lower() not in ("none","nan",""):
            steps.append(f"Consider higher studies similar to alumni: {hs}.")
        timeline = alumni_result.get("timeline",[])
        if timeline and len(timeline) >= 1:
            first = timeline[0]
            steps.append(f"Try to secure an internship or entry role like: '{first}' to get hands-on experience.")
        steps.append("Build 2-3 strong projects (host on GitHub) that demonstrate the above skills.")
        steps.append("Participate in Kaggle / coding competitions and apply to research/internship openings each semester.")
        micro = [
            "Month 1-2: Complete Python and core ML course (end-to-end project).",
            "Month 3-6: Build 1 portfolio project + push code to GitHub; compete in 1 Kaggle contest.",
            "Month 7-12: Apply for internships and industry projects; publish small report or blog."
        ]
        steps.extend(micro)
        guidance = "\n".join([f"- {s}" for s in steps])
        return guidance

# Demo usage
agent = AlumniAgent(DATA_PATH)
results = agent.query("Data Scientist", top_n=5)
for r in results:
    print(r['name'], "-", r['current_companies'])
    print("Timeline:", " -> ".join(r['timeline']))
    print("LinkedIn:", r['linkedin'])
    print("Score:", r['combined_score'])
    print(agent.generate_guidance({}, r))
    print("-" * 40)
