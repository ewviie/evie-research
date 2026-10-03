import { ListChecks } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/** Scannable "Key takeaways" summary shown above the article body. Renders nothing without items. */
export function KeyTakeaways({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <Alert role="note" className="border-border bg-card px-4 py-4">
      <ListChecks aria-hidden />
      <AlertTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Key takeaways
      </AlertTitle>
      <AlertDescription className="text-foreground">
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[0.95rem] leading-relaxed marker:text-muted-foreground">
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
