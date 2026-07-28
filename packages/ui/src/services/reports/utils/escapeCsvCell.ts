export const escapeCsvCell = (value: unknown): string => {
  if (value === null || value === undefined || value === "") {
    return '""'
  }

  const rawString =
    typeof value === "object" ? JSON.stringify(value) : String(value as string | number | boolean | undefined)

  const stringValue = rawString.replace(/\r\n|\r|\n/g, " ")

  return `"${stringValue.replaceAll('"', '""')}"`
}
