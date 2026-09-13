import {
  getDocument,
  VerbosityLevel,
} from "pdfjs-dist/legacy/build/pdf.mjs";

const MAX_PDF_PAGES = 300;
const MAX_EXTRACTED_CHARACTERS = 600_000;

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
      throw new Error("PDF_PAGE_LIMIT");
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
          throw new Error("PDF_TEXT_LIMIT");
        }
      }
      text += "\n";
      page.cleanup();
    }

    if (text.trim().length < 20) throw new Error("PDF_HAS_NO_TEXT");
    return text;
  } finally {
    await task.destroy();
  }
}
