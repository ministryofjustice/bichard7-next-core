export const toTitleCase = (text?: string): string | undefined =>
  text?.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
