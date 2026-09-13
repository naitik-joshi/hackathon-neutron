import { getDocument, VerbosityLevel } from "pdfjs-dist/legacy/build/pdf.mjs";

const MAX_PDF_PAGES = 300;
const MAX_EXTRACTED_CHARACTERS = 600_000;

export type PdfTextErrorCode =
  "MALFORMED_OR_PROTECTED" | "NO_TEXT" | "PAGE_LIMIT" | "TEXT_LIMIT";

export class PdfTextError extends Error {
  readonly code: PdfTextErrorCode;

  constructor(code: PdfTextErrorCode) {
    super(code);
    this.name = "PdfTextError";
    this.code = code;
  }
}

export function pdfTextErrorMessage(error: PdfTextError) {
  if (error.code === "NO_TEXT") {
    return "This PDF does not contain enough extractable text.";
  }
  if (error.code === "PAGE_LIMIT") {
    return "This PDF is too long. Upload a paper with 300 pages or fewer.";
  }
  if (error.code === "TEXT_LIMIT") {
    return "This PDF contains too much extracted text for one submission.";
  }
  return "This PDF could not be read. It may be malformed or password-protected.";
}

export async function extractPdfText(buffer: Buffer) {
  const task = getDocument({
    data: new Uint8Array(buffer),
    stopAtErrors: true,
    useWorkerFetch: false,
    verbosity: VerbosityLevel.ERRORS,
  });

  try {
    const pdf = await task.promise;
    if (pdf.numPages > MAX_PDF_PAGES) {
      throw new PdfTextError("PAGE_LIMIT");
    }

    let text = "";
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      for (const item of content.items) {
        if (!("str" in item)) continue;
        text += item.str;
        text += item.hasEOL ? "\n" : " ";
        if (text.length > MAX_EXTRACTED_CHARACTERS) {
          throw new PdfTextError("TEXT_LIMIT");
        }
      }
      text += "\n";
      page.cleanup();
    }

    if (text.trim().length < 20) throw new PdfTextError("NO_TEXT");
    return text.replace(/(\p{L})-\n(?=\p{Ll})/gu, "$1");
  } catch (error) {
    if (error instanceof PdfTextError) throw error;
    throw new PdfTextError("MALFORMED_OR_PROTECTED");
  } finally {
    try {
      await task.destroy();
    } catch {
      // Cleanup failure must not replace the extraction result/error contract.
    }
  }
}
