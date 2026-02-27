export const toTitleCase = (text?: string): string | undefined =>
  text?.trim() ? text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : undefined
