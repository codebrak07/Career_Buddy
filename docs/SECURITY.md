# Security & Data Privacy

## 1. Client-Side Privacy Architecture
- **Zero Ingestion Leakage**: Profile text and evidence dossiers are processed directly within the client's local browser context during local execution.
- **API Key Guardrails**: When Gemini LLM API keys are provided, they are transmitted via HTTPS directly to Google's inference endpoint without intermediate logging.
- **Sanitization**: All user-pasted text is sanitized to prevent XSS before rendering in the Evidence Dossier or explanation cards.
