export const toTitleCase = (text?: string): string | undefined => {
  if (!text) {
    return undefined
  }

  return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}
