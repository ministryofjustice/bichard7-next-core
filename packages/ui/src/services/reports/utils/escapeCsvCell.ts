export const escapeCsvCell = (value: unknown): string => {
  if (value === null || value === undefined || value === "") {
    return '""'
  }

  const stringValue =
    typeof value === "object" ? JSON.stringify(value) : String(value as string | number | boolean | undefined)

  return `"${stringValue.replaceAll('"', '""')}"`
}
