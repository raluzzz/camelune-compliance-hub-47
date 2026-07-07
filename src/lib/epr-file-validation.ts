export const PDF_ACCEPT = "application/pdf,.pdf";

export function isPdfFile(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return true;
  if (file.type === "application/pdf") return true;
  return false;
}

export function pdfFileError(file: File): string | null {
  if (!isPdfFile(file)) {
    return "Only PDF documents are accepted. Please upload a .pdf file.";
  }
  return null;
}
