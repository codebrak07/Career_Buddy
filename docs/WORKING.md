# Working — Installation, Local Execution & Demo Guide

## 1. Quickstart Commands

```bash
# 1. Clone/navigate into repository
cd /Users/brak/Desktop/HackX

# 2. Install dependencies (Node 18+ required)
npm install

# 3. Launch Vite local dev server
npm run dev
```

The application runs at `http://localhost:5173` (or the next available port).

---

## 2. Production Build Verification

```bash
# Type check and build distribution bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 3. Environment Variables (Optional AI Mode)

The system works 100% deterministically and offline with high-fidelity rule-based normalization and semantic entity mapping.
To connect to live Gemini / LLM models for open-ended document extraction:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

If not provided, the system gracefully falls back to the robust deterministic extractor.

---

## 4. Troubleshooting & FAQ
- **Port in use**: Run `npm run dev -- --port 3000` to bind to an alternative port.
- **Node compatibility**: Tested on Node v20, v22, and v26.
