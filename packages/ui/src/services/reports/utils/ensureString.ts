export const ensureString = (val: unknown): string => {
  if (typeof val === "string") {
    return val
  }

  if (typeof val === "number") {
    return String(val)
  }

  return ""
}
