# Antigravity Grounding & Architecture Rules

## Domain Boundary Rules
1. Never generate, guess, or extrapolate facts outside the parsed document sections.
2. If any queried claim, metric, or explanation is absent from the ingested text, respond strictly:
   "Information not available in the provided document(s)."
3. Always isolate analysis to the requested section header whenever a section is specified.

## Target Research Paper Template Schema
All documents must conform to this exact section hierarchy:
- Header block (Title, Authors, Affiliations, Date, Correspondence)
- Abstract (150-250 words)
- Keywords (Maximum five)
- 1. Introduction
- 2. Literature and Related Work (including 2.1, 2.2, etc.)
- 3. Methodology / Approach
- 4. Results and Discussion (including tables, figures, sub-sections)
- 5. Conclusion
- Disclosure Statement
- Ethical Approval
- Consent to Participate / Consent to Publish
- Data Availability Statement
- Use of Artificial Intelligence (AI) Tools
- Authors’ Contributions
- Funding
- Competing Interests
- Acknowledgements
- References (Harvard Author–Date format)

## Execution Requirements
- Interface with the local Ollama instance running `qwen2.5:3b`.
- Use a live directory watcher (`watchdog`) to parse incoming files dynamically into this schema.
- Run inference with `temperature: 0.0`.