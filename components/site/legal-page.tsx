export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-xl font-bold text-navy">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
