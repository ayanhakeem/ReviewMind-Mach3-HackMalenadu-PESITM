# 🧠 ReviewMind Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Team-Mach%203-blue?style=for-the-badge" alt="Team" />
  <img src="https://img.shields.io/badge/Tech-AI--Orchestrated-blueviolet?style=for-the-badge" alt="Tech" />
</p>

---

**ReviewMind** is a next-generation AI-powered analytics dashboard designed to transform raw product reviews into actionable business intelligence. Developed by **Team Mach 3**, the platform leverages advanced Multi-Model AI to perform high-fidelity sentiment analysis, emotion detection, and competitive benchmarking.

> [!TIP]
> **View Our Gallery**: Check out the high-resolution screenshots and demos here:
> [👉 Mach 3 Sample Photos & Assets](https://drive.google.com/drive/folders/1_wkbScvb0RPbePmuDcy5gUKo_BbvZvLK?usp=drive_link)

---

## ✨ Key Features

### 📊 Executive Benchmarking
Compare up to 3 products side-by-side with our high-fidelity scoring engine.
- **Overall Health Score**: Impact-weighted metric calculating category-specific performance.
- **Authenticity Audit**: AI-driven detection to identify suspected bot reviews and spam patterns.
- **Sentiment Variance**: Visual trace of emotional shifts (Joy, Anger, Disgust, etc.) over time.

### 🧩 Comparative Category Matrix
A revolutionary column-based matrix that breaks down specific pain points:
- **Product Quality**: Build integrity and defect tracking.
- **Delivery Experience**: Logistics partner SLA monitoring.
- **Packaging Integrity**: Safe arrival and material quality metrics.

### 🤖 Actionable AI Suite
- **AI Suggestion Engine**: Automatically generates professional, context-aware responses to customer feedback.
- **Priority Ticket System**: Detects urgent P1 issues and creates actionable items for your product team.

---

## 🛠️ The Tech Stack

### Frontend & UI
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer](https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue)

### Backend & AI
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)
![Puppeteer](https://img.shields.io/badge/Puppeteer-%2340B5A4.svg?style=for-the-badge&logo=puppeteer&logoColor=white)

### Deployment & Infrastructure
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[Public Review URL] --> B[Node.js Scraper]
    B --> C[Custom Data Pipeline]
    C --> D[Gemini 2.5 Flash - Sentiment/Emotion]
    C --> E[Groq Llama 3 - Actionable Insights]
    D --> F[React Dashboard]
    E --> F
    F --> G[Executive Benchmarking]
    F --> H[Comparison Matrix]
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- API Keys for Google Gemini, Groq, and Hugging Face.

### 2. Environment Setup
Create a `.env` file in both `backend` and `review-mind` folders using the provided `.env.example` templates.

### 3. Installation
```bash
# Install root dependencies
npm install

# Run Backend
cd backend
npm install
node server.js

# Run Frontend
cd review-mind
npm install
npm run dev
```

---

## 🤝 Developed by Team Mach 3
*Finalist Submission for Hackathon 2026*

