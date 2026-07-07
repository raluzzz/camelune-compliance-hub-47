/** German LUCID packaging register number: DE + 11 digits. */
export function validateLucidNumber(raw: string): string | null {
  const normalized = raw.replace(/\s+/g, "").toUpperCase();
  if (!normalized) return "Enter your LUCID registration number.";
  if (!/^DE\d{11}$/.test(normalized)) {
    return "Format must be DE followed by 11 digits (e.g. DE12345678901).";
  }
  return null;
}
