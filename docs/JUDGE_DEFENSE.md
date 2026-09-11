# Judge Defense — Tough Questions & Mathematical Answers

---

### Q1: "How do you know the student actually knows this skill?"
**Answer**: We don't take their word for it. We use our 4-tier epistemic classification: `Claimed → Detected → Evidenced → Validated`. A self-claim only gives a nominal 0.15 weight. To reach High Confidence, the student must provide a code repository or pass an interactive timed assessment.

---

### Q2: "Why isn't this just ChatGPT generating career advice?"
**Answer**: LLMs are probabilistic text generators that hallucinate career matches without arithmetic grounding. Our career scoring is 100% deterministic code running a 6-factor linear model with blocker penalties. The LLM is restricted to semantic text extraction and normalization.

---

### Q3: "What stops everyone getting the same career recommendation?"
**Answer**: Our scoring consumes individual evidence artifacts, project commit depths, verified assessment scores, and prerequisite status. Persona A (Frontend projects) gets *Frontend Engineer* at 88%, while Persona B (Statistics coursework) gets *Data Analyst* at 82%, and Persona C (ML theory with no deployment) gets ML as *Reachable* at 54%.

---

### Q4: "Why do you separate Ready Now vs Reachable?"
**Answer**: Flat rankings encourage candidates to apply for roles where they lack non-negotiable fundamentals (like SQL for a database role). Separating them gives candidates immediate high-confidence opportunities while providing a structured, realistic prerequisite roadmap for reach roles.

---

### Q5: "Is your labour market data real-time?"
**Answer**: For this hackathon prototype, we transparently use a curated labor-demand reference model with real-world benchmark weights. In our production architecture, this schema connects directly to live job-market aggregation APIs (O*NET, Lightcast, LinkedIn Economic Graph).

---

### Q6: "What happens if a student completes a course without really learning?"
**Answer**: Course completion is explicitly treated as weak evidence (0.35 weight). The system requires active retrieval (assessment test) or practical proof (GitHub repository) to upgrade the competency to `Validated` (1.00 weight).
