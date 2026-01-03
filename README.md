# 🎯 Path Finder AI

**Path Finder AI** is a career guidance web application designed to help students discover suitable career paths based on their **subjects, skills, and interests**.

The project uses a **rule-based career matching system** enhanced with **AI-generated explanations and job search guidance**.  
It is fully deployed and live.

🔗 **Live Demo:** https://path-finder-ai.netlify.app/

---

## 🚀 Project Overview

Many students struggle to understand which career paths best fit their academic strengths and skill sets.  
Path Finder AI solves this problem by:

- Collecting student inputs (subjects, skills, interests)
- Matching them with suitable career roles using rule-based logic
- Using AI to explain recommendations and guide students toward job opportunities

This project focuses on **clarity, simplicity, and real-world usability**.

---

## 🧠 Key Features

- ✅ Multi-step career assessment UI  
- ✅ Rule-based career matching logic  
- ✅ Career score calculation and ranking  
- ✅ AI-powered explanations using Gemini API  
- ✅ LinkedIn job search guidance (safe, non-scraping approach)  
- ✅ Fully responsive frontend  
- ✅ Secure backend with API key protection  

---

## 🛠️ Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  
- Hosted on **Netlify**

### Backend
- Python  
- Gemini API  
- Flask / FastAPI (Python backend)  
- Hosted separately for security

---

## 📁 Project Structure

project-5/
│
├── frontend/
│ ├── index.html
│ ├── style.css
│ ├── script.js
│ ├── career.json
│
├── backend/
│ ├── backend.py
│ ├── requirements.txt
│ ├── .env
│ ├── .gitignore


---

## ⚙️ How It Works

1. Student selects subjects, skills, and interests
2. Rule-based engine calculates career match scores
3. Top career options are displayed
4. Backend sends selected data to Gemini API
5. AI generates:
   - Career explanation
   - Job application guidance
   - top 3 key points

⚠️ The AI does **not** scrape or fetch live job data.  
It only provides **guidance**.

---

## 🔐 Security & Best Practices

- API keys are stored securely in `.env`
- Backend and frontend are separated
- No sensitive data is exposed on the client side
- AI is used only as an enhancement layer

---

## 📌 Learning Outcomes

Through this project, I learned:

- Designing clean frontend user flows
- Implementing rule-based recommendation systems
- Integrating AI responsibly into applications
- Secure backend development
- Deploying real-world projects online
- Structuring projects using industry standards

---

## 📈 Future Enhancements

- Skill gap analysis
- Learning roadmap generation
- Location-based job search filters
- Resume suggestions using AI
- User accounts and saved results

---

## 👨‍💻 About the Author

I am a **B.Tech AIML student** with a strong interest in building **real-world AI-powered applications**.

This is my **second AI-integrated project**.  
My first project was **KChat-AI**, an AI chatbot built using the Gemini free API.

---

## 📜 Disclaimer

This application is intended for **educational and guidance purposes only**.  
Career suggestions are not guaranteed outcomes and should be used as supportive insights.

---

⭐ If you find this project useful, feel free to star the repository!
