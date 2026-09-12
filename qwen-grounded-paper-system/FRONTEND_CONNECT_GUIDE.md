# Grounded Research AI Backend — Frontend Connection Guide

This document contains everything needed to connect any web UI (Next.js, React, Vue, Svelte) to the live Grounded Research Paper API.

---

## 1. Quick Connection Specs

| Item | Details |
| :--- | :--- |
| **Backend Server URL** | `http://43.204.235.82:8000` |
| **Authentication Header** | `X-API-Key: <YOUR_BACKEND_API_KEY>` (Keep Server-Side Only!) |
| **Content-Type** | `application/json` |
| **Status / Uptime** | Running 24/7 as a systemd daemon (`qwen-api.service`) |

> **Crucial Behavioral Guardrails:**
> - **Strict Closed-Domain Grounding:** The model only extracts facts and metrics explicitly stated in the ingested paper sections.
> - **Anti-Coding Constraint:** If prompted to write code, build scripts, or extrapolate outside the research text, the system strictly returns:  
>   `"Information not available in the provided document(s)."`

---

## 2. Security Architecture: WEB-28 (Server-Side Credential Isolation)

> [!IMPORTANT]
> **NEVER expose the API key in client-side code, git repositories, or `NEXT_PUBLIC_*` environment variables.**
> All requests with `X-API-Key` should be executed **server-side** (e.g., via Next.js Route Handlers / API Routes or server rewrites).

### Step 1: Store Key in Server Environment (`.env.local` on Next.js/Vercel)
Add to your frontend project's `.env.local` (ensure `.env.local` is in `.gitignore`):
```bash
# Server-only (DO NOT prefix with NEXT_PUBLIC_)
QWEN_BACKEND_URL=http://43.204.235.82:8000
QWEN_API_KEY=your_private_api_key_here
```

### Step 2: Create a Server-Side Proxy Route
By proxying queries through a Next.js server route:
1. Your API key remains 100% hidden from the browser / client DevTools.
2. You avoid CORS and browser HTTPS -> HTTP mixed-content errors.

#### Next.js App Router: `app/api/query/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${process.env.QWEN_BACKEND_URL}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.QWEN_API_KEY || '',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to communicate with Qwen backend', details: error.message },
      { status: 500 }
    );
  }
}
```

#### Client-Side Hook / Fetch (Clean & Safe)
Now your React components can query cleanly without handling any credentials:
```typescript
export async function askPaperQuestion(paperName: string, sectionName: string, question: string) {
  const res = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      paper_name: paperName,
      section_name: sectionName,
      question: question,
    }),
  });

  const data = await res.json();
  return data.answer; // Grounded factual text
}
```

---

## 3. Backend Endpoints Reference

All requests sent to the backend must include:
- `X-API-Key: <YOUR_BACKEND_API_KEY>`
- `Content-Type: application/json`

---

### A. List All Available Papers
Retrieves all uploaded research papers and their structured section hierarchy.

- **Method:** `GET`
- **URL:** `http://43.204.235.82:8000/api/papers`
- **Response Structure:**
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

### B. Pre-Warm Model on Paper Select
Warms up the model in memory immediately when a user clicks a paper in your UI, ensuring subsequent queries feel instantaneous.

- **Method:** `POST`
- **URL:** `http://43.204.235.82:8000/api/select_paper`
- **Body:**
```json
{
  "paper_name": "sample_paper.docx"
}
```

---

### C. Query Single Section
Performs strictly grounded factual extraction on an isolated section.

- **Method:** `POST`
- **URL:** `http://43.204.235.82:8000/api/query`
- **Body:**
```json
{
  "paper_name": "sample_paper.docx",
  "section_name": "4. Results and Discussion",
  "question": "What was the exact accuracy and F1-score achieved by the model?"
}
```
- **Response:**
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
Performs comparative analysis between identical sections across two different papers.

- **Method:** `POST`
- **URL:** `http://43.204.235.82:8000/api/compare`
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
Recommends the next relevant paper to explore based on shared terminology in the dataset.

- **Method:** `POST`
- **URL:** `http://43.204.235.82:8000/api/recommend`
- **Body:**
```json
{
  "current_paper": "sample_paper.docx"
}
```
