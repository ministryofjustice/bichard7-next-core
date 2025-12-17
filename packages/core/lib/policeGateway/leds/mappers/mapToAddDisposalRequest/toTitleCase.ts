export const toTitleCase = (text?: string): string =>
  (text || "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
