export function mergeClassNames(existingClassNames: string, newClassNames: string | undefined): string {
  if (!newClassNames) {
    return existingClassNames
  }

  return [...new Set([...existingClassNames.split(" "), ...newClassNames.split(" ")].filter(Boolean))].join(" ")
}
