# CFOx.ai 🦊💼  
**Your AI-Powered CFO — Smarter Finance Decisions, Faster.**  

CFOx.ai is an **AI-driven Chief Financial Officer (CFO) assistant** that helps businesses and individuals manage finances, analyze reports, and make data-backed decisions with ease.  
It combines **RAG (Retrieval-Augmented Generation)**, **LLMs**, and **Qdrant vector database** to give you **real-time insights** like a virtual CFO on demand.  

---

## 🚀 Features  
- 📊 **Financial Analysis:** Instantly analyze P&L, balance sheets, and cash flow statements.  
- 💡 **Conversational Finance Assistant:** Ask CFOx.ai questions in plain English.  
- 🔍 **RAG-based Answers:** Accurate, context-aware responses using Qdrant as the vector database.  
- ⚡ **Automated Reports:** Generate quarterly reports, forecasts, and compliance summaries.  
- 🔐 **Secure Data Handling:** Your financial data stays private.  

---

## 🛠️ Tech Stack  
- **Frontend:** TypeScript + React (Next.js / Vite) + TailwindCSS  
- **Backend:** Flask (Python)  
- **Vector Database:** Qdrant  
- **AI Models:** OpenAI GPT / HuggingFace + LangChain (RAG)  
- **Database:** PostgreSQL / SQLite  
- **Deployment:** Vercel (Frontend), AWS/GCP (Backend)  

---

## 📦 Installation  

### 1. Clone the repo  
```bash
git clone https://github.com/Devyansh26/EvolveAI_AgenticSprint_build.py.git
cd EvolveAI_AgenticSprint_build.py
```
Backend (Flask) Setup
```
cd ai_pipeline
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

pip install -r requirements.txt
```
Create a .env file in backend/:
```
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/cfoxai
```

Run the backend:

flask run

3. Frontend (TypeScript + React) Setup
```   
cd evolve_frontend
npm install
```

Run the frontend:
```
npm run dev
```

📊 Example Usage

Ask CFOx.ai:
"What was our total revenue growth last quarter?"

Generate reports via API:
```
curl -X POST http://127.0.0.1:5000/query \
     -H "Content-Type: application/json" \
     -d '{"query": "What was our total revenue growth last quarter?"}'
```


🏗️ Project Architecture
```
flowchart TD
    A[Frontend - TypeScript/React] --> B[Flask Backend API]
    B --> C[LangChain RAG Engine]
    C --> D[Qdrant Vector Database]
    B --> E[PostgreSQL/SQLite]
    C --> F[OpenAI/HuggingFace Models]
```


🤝 Contributing

📜 License

Licensed under the MIT License. See LICENSE
 for details.

🌟 Acknowledgments

Built with ❤️ using Flask, TypeScript, LangChain, and Qdrant

Inspired by the need for AI-first financial management

👉 With CFOx.ai, finance isn’t just about numbers — it’s about smarter decisions.


---
