import type { Dac7ReportPdfContent } from "@/lib/dac7-report-display";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const TABLE = {
  left: MARGIN,
  right: PAGE_WIDTH - MARGIN,
  columns: {
    quarter: MARGIN + 14,
    sales: 198,
    fees: 298,
    taxes: 408,
    revenue: PAGE_WIDTH - MARGIN - 14,
  },
} as const;

/** Helvetica Type1 in minimal PDFs only supports WinAnsi — normalize Unicode first. */
export function toPdfSafeText(value: string): string {
  return value
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/\u2022/g, "-")
    .replace(/\u20AC/g, "EUR ")
    .replace(/[^\t\n\r\x20-\x7E]/g, "");
}

function escapePdfText(value: string): string {
  return toPdfSafeText(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function approxTextWidth(text: string, size: number): number {
  return text.length * size * 0.52;
}

type TextOptions = {
  size?: number;
  bold?: boolean;
  gray?: number;
  align?: "left" | "right";
};

type PdfOp =
  | { kind: "rect"; x: number; y: number; w: number; h: number; fill?: number; stroke?: boolean }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "text"; x: number; y: number; text: string; opts?: TextOptions };

function money(value: number): string {
  return `EUR ${value.toLocaleString("en-GB")}`;
}

function buildLayout(content: Dac7ReportPdfContent): PdfOp[] {
  const ops: PdfOp[] = [];
  let y = PAGE_HEIGHT - MARGIN;

  const text = (
    value: string,
    x: number,
    baselineY: number,
    opts: TextOptions = {},
  ) => {
    const size = opts.size ?? 11;
    const resolvedX =
      opts.align === "right" ? x - approxTextWidth(value, size) : x;
    ops.push({
      kind: "text",
      x: resolvedX,
      y: baselineY,
      text: value,
      opts,
    });
  };

  const sectionTitle = (label: string, baselineY: number) => {
    text(label, MARGIN, baselineY, { size: 13, bold: true });
  };

  const fieldRow = (label: string, value: string, baselineY: number) => {
    text(label, MARGIN + 2, baselineY, { size: 10, gray: 0.45 });
    text(value, MARGIN + 220, baselineY, { size: 11 });
    ops.push({
      kind: "line",
      x1: MARGIN,
      y1: baselineY - 10,
      x2: PAGE_WIDTH - MARGIN,
      y2: baselineY - 10,
    });
  };

  text(`DAC7 Report - ${content.year}`, MARGIN, y, { size: 22, bold: true });
  y -= 28;
  text(
    `Detailed view of the data Camelune reported to the tax authority for the ${content.year} reporting period.`,
    MARGIN,
    y,
    { size: 10, gray: 0.45 },
  );
  y -= 34;

  const statusBoxTop = y;
  const statusBoxHeight = 54;
  ops.push({
    kind: "rect",
    x: MARGIN,
    y: statusBoxTop - statusBoxHeight,
    w: CONTENT_WIDTH,
    h: statusBoxHeight,
    stroke: true,
  });
  text(content.status, MARGIN + 14, y - 20, { size: 15, bold: true });
  text(
    `Submitted ${content.submitted} · Reference ${content.reference}`,
    MARGIN + 14,
    y - 38,
    { size: 10, gray: 0.45 },
  );
  y -= statusBoxHeight + 28;

  sectionTitle("Company information reported", y);
  y -= 26;
  const sellerRows: [string, string][] = [
    ["Company name", content.seller.companyName],
    ["Country", content.seller.country],
    ["VAT number", content.seller.vatNumber],
    ["Commercial registration", content.seller.registrationNumber],
    ["Taxpayer ID", content.seller.taxpayerId],
  ];
  for (const [label, value] of sellerRows) {
    fieldRow(label, value, y);
    y -= 24;
  }
  y -= 12;

  sectionTitle("Sales and revenue", y);
  y -= 18;

  const headerBaseline = y;
  const rowHeight = 24;
  const tableTop = headerBaseline + 8;
  const bodyRows = [...content.quarters, content.totals];
  const tableHeight = rowHeight * (bodyRows.length + 1);

  ops.push({
    kind: "rect",
    x: TABLE.left,
    y: tableTop - tableHeight,
    w: CONTENT_WIDTH,
    h: tableHeight,
    stroke: true,
  });
  ops.push({
    kind: "rect",
    x: TABLE.left,
    y: tableTop - rowHeight,
    w: CONTENT_WIDTH,
    h: rowHeight,
    fill: 0.96,
  });
  ops.push({
    kind: "line",
    x1: TABLE.left,
    y1: tableTop - rowHeight,
    x2: TABLE.right,
    y2: tableTop - rowHeight,
  });

  const headers = [
    ["QUARTER", TABLE.columns.quarter, "left" as const],
    ["SALES COUNT", TABLE.columns.sales, "right" as const],
    ["FEES", TABLE.columns.fees, "right" as const],
    ["TAXES", TABLE.columns.taxes, "right" as const],
    ["REVENUE", TABLE.columns.revenue, "right" as const],
  ];
  for (const [label, x, align] of headers) {
    text(label, x, headerBaseline - 6, { size: 8, bold: true, gray: 0.45, align });
  }

  bodyRows.forEach((row, index) => {
    const baseline = headerBaseline - rowHeight * (index + 1) - 6;
    const isTotal = index === bodyRows.length - 1;

    if (isTotal) {
      ops.push({
        kind: "rect",
        x: TABLE.left,
        y: baseline - 8,
        w: CONTENT_WIDTH,
        h: rowHeight,
        fill: 0.98,
      });
    } else {
      ops.push({
        kind: "line",
        x1: TABLE.left,
        y1: baseline - 8,
        x2: TABLE.right,
        y2: baseline - 8,
      });
    }

    const label = isTotal ? "Total" : row.q;
    text(label, TABLE.columns.quarter, baseline, { size: 11, bold: isTotal });
    text(String(row.sales), TABLE.columns.sales, baseline, {
      size: 11,
      bold: isTotal,
      align: "right",
    });
    text(money(row.fees), TABLE.columns.fees, baseline, {
      size: 11,
      bold: isTotal,
      align: "right",
    });
    text(money(row.taxes), TABLE.columns.taxes, baseline, {
      size: 11,
      bold: isTotal,
      align: "right",
    });
    text(money(row.revenue), TABLE.columns.revenue, baseline, {
      size: 11,
      bold: isTotal,
      align: "right",
    });
  });

  return ops;
}

function renderOps(ops: PdfOp[]): string {
  const chunks: string[] = [];

  for (const op of ops) {
    if (op.kind === "rect") {
      chunks.push(`${op.x} ${op.y} ${op.w} ${op.h} re`);
      if (op.fill !== undefined) {
        chunks.push(`${op.fill} g`);
        chunks.push("f");
        chunks.push("0 g");
      }
      if (op.stroke) {
        chunks.push("0.45 G");
        chunks.push("S");
        chunks.push("0 G");
      }
      continue;
    }

    if (op.kind === "line") {
      chunks.push("0.75 w");
      chunks.push("0.45 G");
      chunks.push(`${op.x1} ${op.y1} m ${op.x2} ${op.y2} l S`);
      chunks.push("0 G");
      continue;
    }

    const size = op.opts?.size ?? 11;
    const font = op.opts?.bold ? "/F2" : "/F1";
    const gray = op.opts?.gray;
    if (gray !== undefined) {
      chunks.push(`${gray} g`);
    }
    chunks.push("BT");
    chunks.push(`${font} ${size} Tf`);
    chunks.push(`1 0 0 1 ${op.x} ${op.y} Tm`);
    chunks.push(`(${escapePdfText(op.text)}) Tj`);
    chunks.push("ET");
    if (gray !== undefined) {
      chunks.push("0 g");
    }
  }

  return chunks.join("\n");
}

function buildDac7ReportPdf(content: Dac7ReportPdfContent): Uint8Array {
  const stream = renderOps(buildLayout(content));
  const streamLength = new TextEncoder().encode(stream).length;

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
  ];

  let body = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (const object of objects) {
    offsets.push(body.length);
    body += object;
  }

  const xrefStart = body.length;
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i += 1) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  body += `startxref\n${xrefStart}\n%%EOF`;

  return new TextEncoder().encode(body);
}

export function buildDac7ReportPdfBytes(content: Dac7ReportPdfContent): Uint8Array {
  return buildDac7ReportPdf(content);
}

export function downloadDac7ReportPdf(
  filename: string,
  content: Dac7ReportPdfContent,
): void {
  const pdf = buildDac7ReportPdfBytes(content);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
