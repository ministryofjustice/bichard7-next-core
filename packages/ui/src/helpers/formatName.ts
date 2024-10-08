export function formatName(name: string) {
  let splitName = name.replace(/\*|\s+/g, "%")

  if (!name.includes("%") && !splitName.endsWith("%")) {
    splitName = `${splitName}%`
  }

  return splitName
}
