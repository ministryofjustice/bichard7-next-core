export default (value?: string | boolean | null): boolean | undefined => {
  if (value === undefined || value === null) {
    return undefined
  }

  const trimmedValue = typeof value === "string" ? value.trim().toLowerCase() : value

  if (["y", true].includes(trimmedValue)) {
    return true
  }

  if (["n", false].includes(trimmedValue)) {
    return false
  }

  return undefined
}
