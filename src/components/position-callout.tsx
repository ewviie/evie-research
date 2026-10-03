/** Structured "Position" box shown at the top of every research note. */
export function PositionCallout({ company, position }: { company: string; position: string }) {
  if (!position) return null;
  return (
    <aside aria-label="Position disclosure" className="rounded-md border border-border border-l-4 border-l-primary bg-accent px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Position</p>
      <p className="mt-1 font-medium">
        {company} — {position}
      </p>
    </aside>
  );
}
