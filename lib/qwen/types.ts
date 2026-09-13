export type QwenPaper = {
  filename: string;
  title: string;
  section_count: number;
  sections: string[];
};

export type QwenErrorBody = {
  status: "error";
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
};

export type PapersResponse = {
  status: "success";
  count: number;
  papers: QwenPaper[];
};

export type QueryResponse = {
  status: "success";
  paper_name: string;
  section_matched: string;
  question: string;
  answer: string;
  latency_ms: number;
  is_grounded: boolean;
  hard_negative: boolean;
};

export type Recommendation = {
  paper_name: string;
  title: string;
  similarity_score: number;
  shared_keywords: string[];
};

export type RecommendResponse = {
  status: "success";
  source_paper: string;
  recommendation: Recommendation | null;
  recommendations: Recommendation[];
  method: "indexed_lexical_overlap";
  model_used: false;
};

export type CompareResponse = {
  status: "success";
  paper_1: string;
  paper_2: string;
  section: string;
  question: string;
  answer: string;
  latency_ms: number;
  is_grounded: boolean;
  hard_negative: boolean;
};

export type HealthResponse = {
  status: "healthy" | "degraded";
  ollama_ready?: boolean;
  model?: string;
};
