export function mergeClassNames(...classNames: Array<string | undefined>): string {
  return [...new Set([...classNames.filter(Boolean).flatMap((className) => className?.split(" "))])].join(" ")
}
