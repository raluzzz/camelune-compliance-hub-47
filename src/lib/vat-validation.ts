export const VAT_COUNTRIES = [
  "Romania",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Austria",
  "Poland",
] as const;

export type VatCountry = (typeof VAT_COUNTRIES)[number];

export type VatVerificationStatus = "Verified" | "Pending verification" | "Invalid";

/** Normalize user input: strip spaces and uppercase country prefix. */
export function normalizeVatNumber(raw: string): string {
  return raw.replace(/\s+/g, "").toUpperCase();
}

const VAT_PATTERNS: Record<VatCountry, RegExp> = {
  Romania: /^RO\d{2,10}$/,
  Germany: /^DE\d{9}$/,
  France: /^FR[A-HJ-NP-Z0-9]{2}\d{9}$/,
  Italy: /^IT\d{11}$/,
  Spain: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
  Netherlands: /^NL\d{9}B\d{2}$/,
  Belgium: /^BE0?\d{9}$/,
  Austria: /^ATU\d{8}$/,
  Poland: /^PL\d{10}$/,
};

export function vatFormatError(country: string, rawNumber: string): string | null {
  if (!VAT_COUNTRIES.includes(country as VatCountry)) {
    return "Select a supported EU country.";
  }
  const normalized = normalizeVatNumber(rawNumber);
  if (!normalized) return "Enter a VAT number.";
  const pattern = VAT_PATTERNS[country as VatCountry];
  if (!pattern.test(normalized)) {
    return `Invalid format for ${country}. Check the country prefix and digit count.`;
  }
  return null;
}

/** Simulated VIES check — known demo numbers verify; valid format otherwise stays pending. */
const KNOWN_VERIFIED = new Set(
  ["RO42183901", "DE312456789", "FR76123456789"].map(normalizeVatNumber),
);

export function verifyVatNumber(
  country: string,
  rawNumber: string,
): { status: VatVerificationStatus; normalized: string; error: string | null } {
  const error = vatFormatError(country, rawNumber);
  const normalized = normalizeVatNumber(rawNumber);
  if (error) {
    return { status: "Invalid", normalized, error };
  }
  if (KNOWN_VERIFIED.has(normalized)) {
    return { status: "Verified", normalized, error: null };
  }
  return { status: "Pending verification", normalized, error: null };
}

export function formatVatDisplay(normalized: string, country: VatCountry): string {
  if (country === "Romania" && /^RO\d+$/.test(normalized)) {
    return `RO ${normalized.slice(2)}`;
  }
  if (country === "Germany" && /^DE\d{9}$/.test(normalized)) {
    return normalized;
  }
  if (country === "France" && /^FR/.test(normalized)) {
    return `${normalized.slice(0, 2)} ${normalized.slice(2, 4)} ${normalized.slice(4)}`;
  }
  return normalized;
}
