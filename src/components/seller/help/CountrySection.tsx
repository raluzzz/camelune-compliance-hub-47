import type { ReactNode } from "react";

export type RequirementPart = string | { label: string; url: string };

export interface CountrySubsectionData {
  requirements: RequirementPart[][];
  cameluneRequires: string[];
}

export interface CountrySectionData {
  flag: string;
  country: string;
  basedIn: CountrySubsectionData;
  basedOutside: CountrySubsectionData;
}

function ExternalLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ink underline-offset-4 hover:underline"
    >
      {label}
    </a>
  );
}

function RequirementLine({ parts }: { parts: RequirementPart[] }) {
  return (
    <li className="text-sm text-muted-foreground leading-relaxed">
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <ExternalLink key={i} label={part.label} url={part.url} />
        ),
      )}
    </li>
  );
}

function Subsection({
  title,
  data,
}: {
  title: string;
  data: CountrySubsectionData;
}) {
  return (
    <div className="mt-8">
      <h4 className="text-sm font-medium text-ink">{title}</h4>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mt-5 mb-3">
        Requirements:
      </p>
      <ul className="list-disc pl-5 space-y-2">
        {data.requirements.map((parts, i) => (
          <RequirementLine key={i} parts={parts} />
        ))}
      </ul>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mt-6 mb-3">
        What Camelune requires from you:
      </p>
      <div className="bg-cream/60 border border-line/80 p-5">
        <ul className="list-disc pl-5 space-y-2">
          {data.cameluneRequires.map((item) => (
            <li key={item} className="text-sm text-ink leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CountrySection({ data }: { data: CountrySectionData }) {
  return (
    <section className="mt-14 pt-2 border-t border-line">
      <h3 className="text-lg text-ink">
        <span className="mr-2" aria-hidden>
          {data.flag}
        </span>
        {data.country}
      </h3>
      <Subsection title={`If your company is based in ${data.country}`} data={data.basedIn} />
      <Subsection
        title={`If your company is based outside ${data.country}`}
        data={data.basedOutside}
      />
    </section>
  );
}

export function NoteBox({ children }: { children: ReactNode }) {
  return (
    <div className="border border-line bg-muted/20 p-6 mt-8">
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
