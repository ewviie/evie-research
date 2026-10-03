import { Info, Lightbulb, TriangleAlert, type LucideIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const kinds: Record<string, { icon: LucideIcon; label: string; className: string }> = {
  note: { icon: Info, label: "Note", className: "border-l-primary bg-accent text-accent-foreground" },
  thesis: { icon: Lightbulb, label: "Thesis", className: "border-l-foreground bg-secondary" },
  risk: { icon: TriangleAlert, label: "Risk", className: "border-l-destructive bg-secondary" },
};

/** MDX callout built on shadcn/ui Alert: <Callout type="note|thesis|risk" title="...">. */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: "note" | "thesis" | "risk";
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, label, className } = kinds[type];
  return (
    // role="note": a static aside, not a live "alert" announcement.
    <Alert role="note" className={cn("not-prose border-l-4 px-4 py-3 text-[0.95rem] leading-relaxed", className)}>
      <Icon aria-hidden />
      <AlertTitle className="text-xs font-semibold uppercase tracking-wider">{title ?? label}</AlertTitle>
      <AlertDescription className="text-foreground [&>p+p]:mt-2">{children}</AlertDescription>
    </Alert>
  );
}
