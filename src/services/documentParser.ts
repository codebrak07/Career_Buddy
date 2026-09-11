/**
 * Document Text Extraction Service
 * 
 * Accurately extracts clean textual content from uploaded candidate resumes:
 * - PDF documents (via pdfjs-dist / stream text decoder)
 * - Plain text (.txt, .md, .json)
 * - Strips binary bytecode / PDF object tags so Groq AI receives pure human-readable text.
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker for Vite client environment
try {
  if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }
} catch {
  // Fallback if cdn not reachable
}

/**
 * Fallback heuristic stream cleaner if PDF worker or stream fails
 */
function extractReadableStringsFromBinary(rawText: string): string {
  // Extract text within parentheses in PDF content streams e.g. (John Doe) Tj or [(John) 10 (Doe)] TJ
  const tjMatches: string[] = [];
  const tjRegex = /\(([^()]{2,})\)\s*Tj/g;
  let match;
  while ((match = tjRegex.exec(rawText)) !== null) {
    tjMatches.push(match[1]);
  }

  // Also check TJ array format
  const arrayTjRegex = /\[(.*?)\]\s*TJ/g;
  while ((match = arrayTjRegex.exec(rawText)) !== null) {
    const inner = match[1];
    const parts = inner.match(/\(([^()]+)\)/g);
    if (parts) {
      tjMatches.push(parts.map(p => p.slice(1, -1)).join(' '));
    }
  }

  if (tjMatches.length > 5) {
    return tjMatches.join(' ').replace(/\\([()\\])/g, '$1').trim();
  }

  // General ASCII printable filter: strip PDF headers like %PDF-1.4, obj, stream, xref, trailer
  const cleaned = rawText
    .replace(/%PDF-[\d.]+/g, '')
    .replace(/\d+\s+\d+\s+obj[\s\S]*?endobj/g, ' ')
    .replace(/stream[\s\S]*?endstream/g, ' ')
    .replace(/xref[\s\S]*?trailer/g, ' ')
    .replace(/[^\x20-\x7E\t\n\r]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return cleaned;
}

export async function extractTextFromDocument(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // 1. Plain text formats
  if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.json')) {
    const text = await file.text();
    return text.trim();
  }

  // 2. PDF documents
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useSystemFonts: true,
      });

      const pdf = await loadingTask.promise;
      const pagesText: string[] = [];

      for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageStrings = textContent.items
          .map((item: any) => item.str || '')
          .filter((str: string) => str.trim().length > 0);
        
        if (pageStrings.length > 0) {
          pagesText.push(pageStrings.join(' '));
        }
      }

      const extracted = pagesText.join('\n\n').trim();
      if (extracted.length > 40) {
        return extracted;
      }
    } catch (pdfErr) {
      console.warn('pdfjs-dist extraction notice, attempting stream heuristic:', pdfErr);
    }

    // Fallback if pdfjs-dist failed (e.g. strict security origin or worker issue)
    try {
      const rawText = await file.text();
      const heuristicText = extractReadableStringsFromBinary(rawText);
      if (heuristicText && heuristicText.length > 30) {
        return heuristicText;
      }
    } catch {
      // ignore
    }
  }

  // 3. General fallback
  try {
    const text = await file.text();
    const sanitized = text.replace(/[^\x20-\x7E\t\n\r]/g, ' ').replace(/\s{2,}/g, ' ').trim();
    return sanitized.slice(0, 20000);
  } catch {
    return `[Attached Document: ${file.name}]`;
  }
}
