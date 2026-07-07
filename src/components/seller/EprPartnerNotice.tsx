export function EprPartnerNotice({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="mt-6 mb-12 text-[13px] text-muted-foreground max-w-2xl">
        Need help with registration? A certified EPR partner service is coming
        soon on Camelune.
      </p>
    );
  }

  return (
    <section className="border border-line bg-background p-6 mb-8">
      <p className="text-[15px] text-ink mb-2">Need help obtaining your registration?</p>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
        Camelune is partnering with a certified EPR compliance provider to help
        sellers obtain registrations and certificates across EU markets. This
        service will be available here soon — you can also complete each
        registration independently through the official authority portal on the
        relevant obligation page.
      </p>
    </section>
  );
}
