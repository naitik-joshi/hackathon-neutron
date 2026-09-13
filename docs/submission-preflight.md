# Submission readiness

Submission Readiness is an advisory research-preparation tool for researchers and administrators. It connects a draft to already-published Hub work, suggests topics from the current research-area taxonomy, and checks basic reference formatting and completeness. It does not score academic quality and never blocks submission.

## Architecture

The feature lives under `features/preflight/`. Pure text, similarity, topic, and citation helpers are independent from Supabase retrieval and React. A researcher-triggered server action validates the draft with Zod, authorizes the researcher, loads a bounded public reference dataset, runs the pure analysis, and returns only the shaped result needed by the interface.

The interactive `SubmissionReadiness` client island owns draft reference text and stale-result state. Publication title and abstract remain the real form fields. The references textarea has no `name`, so it is not included in the publication submission `FormData`.

## Related-work algorithm

The checker compares the draft with up to 100 recent published Hub publications. It normalizes and tokenizes the title and abstract, assigns title terms a weight of 3 and abstract terms a weight of 1, then calculates weighted cosine similarity. Results below the meaningful display threshold are omitted. Remaining results are ordered by score, then title and ID for deterministic ties, and limited to five.

Shared non-generic terms and adjacent two-word phrases explain why a record appears. The interface calls the number “lexical overlap” and groups it as low, moderate, or high overlap. It never describes the result as plagiarism, originality, copying, misconduct, or certification.

Only records with `status = published` are requested. A defense-in-depth mapper discards any other status. A current publication ID can be excluded during edit/resubmit and admin recomputation. Related results include only ID, slug, title, real year, DEMO DATA state, overlap, and shared terms; candidate abstracts do not cross to the browser.

## Normalization and limitations

Text is normalized with Unicode NFKC, lowercased, stripped of punctuation, and collapsed to single spaces. Common English stopwords, very short noise, generic academic filler, and the disclosure words “DEMO DATA” are excluded from analysis. A small meaningful-short-term allowlist retains terms such as AI and ML.

Lexical overlap cannot identify conceptually related work that uses different vocabulary. It compares only the bounded set of published Hub records, so an empty result does not establish originality. It uses no embeddings, external index, LLM, or plagiarism service.

## Research-area suggestions

The draft is compared with each stored research area's name and description. Exact area-name phrases and title matches receive stronger weight; ordinary matching terms contribute proportionally. Only meaningful matches are returned, up to three. Each result is described as a possible, moderate, or strong suggestion and links to the real public area route. Suggestions are not persisted or automatically assigned.

## Keyword extraction

Keywords and two-word phrases come from term frequency with title and phrase boosts. Stopwords and generic research filler are removed. Stable score and alphabetical tie-breaking produce five to eight deterministic suggestions when the draft contains enough topical language.

## Citation-readiness rules

References are interpreted as one non-empty line each. The checker reports:

- number of references supplied;
- references containing a plausible `19xx` or `20xx` year;
- exact or effectively identical duplicate lines after normalization;
- DOI-looking values and malformed DOI syntax;
- HTTP/HTTPS-looking values and malformed URL syntax;
- extremely short or identifier-only lines that may need citation details.

The result is “Looks complete,” “Review recommended,” or “No references provided.” These are formatting-readiness states, not academic pass/fail results.

The checker does not establish whether a source exists, supports the research, is credible, is factually correct, follows a particular citation style, or is academically correct. DOI and URL checks cover syntax only.

## Privacy and persistence

Reference text and computed results are ephemeral. They are sent only to the authenticated readiness server action, returned to the current page, and are not stored in PostgreSQL. No table, bibliography, tag, or result schema was added. The publication submission action continues to accept only the existing publication fields.

Researchers access the action through the existing researcher authorization guard. Admin research context is recomputed server-side on a guarded submission-detail route from the saved title and abstract. Admin context includes related published work, area suggestions, and keywords; it omits citation readiness because references are not stored. It is explicitly labeled as recomputed context, not the researcher's earlier result.

## Scaling limit

The current implementation analyzes at most 100 recent published publications and 100 research areas in memory. That is appropriate for the hackathon dataset and avoids sending the corpus to the browser. A larger institutional dataset would need indexed retrieval or a staged candidate-selection strategy before running the same explainable scoring.

## How to explain this in the demo

Before submitting, a researcher can run an explainable readiness check. The Hub compares the title and abstract with already-published Hub research, suggests relevant topics from the institution's stored taxonomy, and checks basic reference completeness. Researchers can inspect every reason and remain free to submit; the feature does not claim plagiarism detection, citation correctness, or academic validation.
