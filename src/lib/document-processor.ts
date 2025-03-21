import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
const loadPdfWorker = async () => {
  const worker = await import('pdfjs-dist/build/pdf.worker.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = worker.default;
};

// Initialize PDF.js worker
loadPdfWorker();

interface ProcessingProgress {
  progress: number;
  message: string;
}

export async function extractTextFromDocument(
  file: File,
  onProgress: (progress: ProcessingProgress) => void
): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type.toLowerCase();

  onProgress({ progress: 10, message: 'Starting document processing...' });

  // Handle PDFs
  if (extension === 'pdf' || mimeType === 'application/pdf') {
    return extractFromPDF(file, onProgress);
  }

  // Handle images
  if (
    mimeType.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')
  ) {
    return extractFromImage(file, onProgress);
  }

  // Handle text files
  if (extension === 'txt' || mimeType === 'text/plain') {
    onProgress({ progress: 50, message: 'Reading text file...' });
    return file.text();
  }

  throw new Error(
    'Unsupported file type. Please upload a PDF, image, or text file.'
  );
}

async function extractFromPDF(
  file: File,
  onProgress: (progress: ProcessingProgress) => void
): Promise<string> {
  onProgress({ progress: 20, message: 'Loading PDF...' });

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  let fullText = '';
  let needsOCR = false;

  for (let i = 1; i <= numPages; i++) {
    onProgress({
      progress: 20 + (i / numPages) * 40,
      message: `Processing page ${i} of ${numPages}...`,
    });

    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => (item as any).str)
      .join(' ');

    // If page has very little text, it might be scanned - mark for OCR
    if (pageText.trim().length < 50) {
      needsOCR = true;
      // Render page to canvas for OCR
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Failed to get canvas context');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      onProgress({
        progress: 60 + (i / numPages) * 20,
        message: `Performing OCR on page ${i}...`,
      });

      const ocrText = await performOCR(canvas);
      fullText += ocrText + '\n\n';
    } else {
      fullText += pageText + '\n\n';
    }
  }

  onProgress({ progress: 90, message: 'Finalizing document processing...' });
  return fullText.trim();
}

async function extractFromImage(
  file: File,
  onProgress: (progress: ProcessingProgress) => void
): Promise<string> {
  onProgress({ progress: 30, message: 'Preparing image for OCR...' });

  const imageUrl = URL.createObjectURL(file);
  try {
    onProgress({ progress: 50, message: 'Performing OCR on image...' });
    const text = await performOCR(imageUrl);
    onProgress({ progress: 90, message: 'Finalizing OCR processing...' });
    return text;
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

async function performOCR(source: string | HTMLCanvasElement): Promise<string> {
  const worker = await createWorker('eng');
  try {
    const {
      data: { text },
    } = await worker.recognize(source);
    await worker.terminate();
    return text;
  } catch (error) {
    await worker.terminate();
    throw new Error(
      'OCR processing failed: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}
