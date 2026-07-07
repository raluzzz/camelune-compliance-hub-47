import { describe, expect, it } from "vitest";
import { isPdfFile, pdfFileError } from "@/lib/epr-file-validation";

describe("epr file validation", () => {
  it("accepts PDF files by extension or mime type", () => {
    expect(isPdfFile(new File(["x"], "proof.pdf", { type: "application/pdf" }))).toBe(true);
    expect(isPdfFile(new File(["x"], "proof.pdf", { type: "" }))).toBe(true);
  });

  it("rejects non-PDF files", () => {
    const png = new File(["x"], "image.png", { type: "image/png" });
    expect(isPdfFile(png)).toBe(false);
    expect(pdfFileError(png)).toMatch(/Only PDF/);
  });
});
