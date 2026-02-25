export const escapeCsvCell = (value: unknown): string => {
  if (value === null || value === undefined || value === "") {
    return '""'
  }

  const stringValue = String(value)

  return `"${stringValue.replaceAll('"', '""')}"`
}
