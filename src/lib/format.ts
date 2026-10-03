/** Client-safe formatting helpers (no Node APIs). */

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

const ACRONYMS = new Set(["ai", "esg", "ipo", "etf", "uk", "us"]);

export const tagLabel = (tag: string) =>
  tag.split("-").map((w) => (ACRONYMS.has(w) ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1))).join(" ");
