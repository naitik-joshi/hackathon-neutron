# Grounded Research AI Backend — Frontend Connection Guide

This document contains everything needed to connect any web UI (React, Next.js, Vue, Svelte, or vanilla JS) to the live Grounded Research Paper API.

---

## 1. Quick Connection Specs

| Item | Details |
| :--- | :--- |
| **Direct Server URL** | `http://43.204.235.82:8000` |
| **Authentication Header** | `X-API-Key: qwen_live_QJzhiLUyxKa6BfMFnDVysKxSCJIXYEx1` |
| **Content-Type** | `application/json` |
| **Status / Uptime** | Running 24/7 as a systemd service (`qwen-api.service`) |

> **Note on Strict System Behavior:**
> - **Zero Hallucination / Strict Grounding:** The AI only answers using facts and metrics from the parsed research paper sections.
> - **Anti-Coding Guardrail:** If asked to generate software code, scripts, or answer outside the text, the system strictly outputs:  
>   `"Information not available in the provided document(s)."`

---

## 2. API Endpoints Reference

### A. List All Available Papers
Retrieves all uploaded research papers and their extracted sections.

- **Method:** `GET`
- **URL:** `/api/papers`
- **Headers:** `X-API-Key: qwen_live_QJzhiLUyxKa6BfMFnDVysKxSCJIXYEx1`
- **Response Example:**
```json
{
  "total_papers": 7,
  "papers": [
    {
      "filename": "sample_paper.docx",
      "title": "A Fully Grounded Architecture for Document Analysis",
      "total_sections": 18,
      "sections": [
        "Header block",
        "Abstract",
        "Keywords",
        "1. Introduction",
        "2. Literature and Related Work",
        "3. Methodology / Approach",
        "4. Results and Discussion",
        "5. Conclusion"
      ]
    }
  ]
}
```

---

### B. Pre-Warm Model on Paper Select (Instant Response Optimization)
Call this as soon as the user clicks a paper in your sidebar/dropdown. It warms up the model in the background so queries execute with zero delay.

- **Method:** `POST`
- **URL:** `/api/select_paper`
- **Headers:**
  - `X-API-Key: qwen_live_QJzhiLUyxKa6BfMFnDVysKxSCJIXYEx1`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "paper_name": "sample_paper.docx"
}
```

---

### C. Query Single Paper Section
Performs strictly grounded factual analysis on a specific section of a paper.

- **Method:** `POST`
- **URL:** `/api/query`
- **Headers:**
  - `X-API-Key: qwen_live_QJzhiLUyxKa6BfMFnDVysKxSCJIXYEx1`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "paper_name": "sample_paper.docx",
  "section_name": "4. Results and Discussion",
  "question": "What was the exact accuracy and F1-score achieved by the model?"
}
```
- **Response Example:**
```json
{
  "status": "success",
  "paper_name": "sample_paper.docx",
  "section_matched": "4. Results and Discussion",
  "question": "What was the exact accuracy and F1-score achieved by the model?",
  "answer": "The model achieved an Factual Accuracy of 96.8% and an F1-Score of 98.4%.",
  "latency_ms": 1229.8,
  "is_grounded": true,
  "hard_negative": false
}
```

---

### D. Cross-Paper Comparison
Compares the same section across two different research papers.

- **Method:** `POST`
- **URL:** `/api/compare`
- **Headers:**
  - `X-API-Key: qwen_live_QJzhiLUyxKa6BfMFnDVysKxSCJIXYEx1`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "paper1_name": "sample_paper.docx",
  "paper2_name": "sample_paper_2.txt",
  "section_name": "4. Results and Discussion",
  "question": "Compare the performance metrics between both papers."
}
```

---

### E. Grounded Paper Recommendation
Recommends the next relevant paper to read based purely on shared terminology in the dataset.

- **Method:** `POST`
- **URL:** `/api/recommend`
- **Headers:**
  - `X-API-Key: qwen_live_QJzhiLUyxKa6BfMFnDVysKxSCJIXYEx1`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "current_paper": "sample_paper.docx"
}
```

---

## 3. Important: Vercel / Next.js Setup (Avoid Mixed-Content)

Because Vercel hosts your frontend over **HTTPS**, modern web browsers block requests sent directly to an `http://` backend ("Mixed Content Error").

To solve this cleanly, add an API rewrite in your Next.js config so the frontend calls `/api/*` on its own domain, and Next.js proxies it server-side to the EC2 instance:

### If using Next.js (`next.config.js` or `next.config.mjs`):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/backend-api/:path*',
        destination: 'http://43.204.235.82:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
```

### If using Vite / Plain Vercel (`vercel.json`):
```json
{
  "rewrites": [
    {
      "source": "/backend-api/(.*)",
      "destination": "http://43.204.235.82:8000/api/$1"
    }
  ]
}
```

---

## 4. Frontend Example (React / TypeScript / JavaScript)

```typescript
const API_KEY = "qwen_live_QJzhiLUyxKa6BfMFnDVysKxSCJIXYEx1";

// If using the rewrite proxy:
const BASE_URL = "/backend-api"; 
// Or if direct: "http://43.204.235.82:8000/api"

export async function askQuestion(paperName: string, sectionName: string, question: string) {
  const response = await fetch(`${BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({
      paper_name: paperName,
      section_name: sectionName,
      question: question,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.answer; // Contains factual extraction or "Information not available in the provided document(s)."
}
```
