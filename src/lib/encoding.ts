const entities: { [k: string]: string } = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&apos;": "'",
  "&quot;": '"'
}

export const decodeEntities = (value: string): string =>
  value.replace(/&[^;]+;/g, (match: string): string => {
    const replacement = entities[match]
    return replacement ? replacement : match
  })

export const decodeEntitiesProcessor = (_: string, value: string): string => decodeEntities(value)

export const encodeEntities = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export const encodeEntitiesProcessor = (_: string, value: string): string =>
  typeof value === "string" ? encodeEntities(value) : value
