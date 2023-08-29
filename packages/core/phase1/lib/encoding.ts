const tagEntities: { [k: string]: string } = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&apos;": "'"
}

const attributeEntities: { [k: string]: string } = {
  ...tagEntities,
  "&quot;": '"'
}

const decodeEntities = (value: string, valueLookup: Record<string, string>): string =>
  value.replace(/&[^;]+;/g, (match: string): string => {
    const replacement = valueLookup[match]
    return replacement ? replacement : match
  })

const encodeTagEntities = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const encodeAttributeEntities = (value: string): string => encodeTagEntities(value).replace(/"/g, "&quot;")

export const decodeAttributeEntitiesProcessor = (_: string, value: string): string =>
  decodeEntities(value, attributeEntities)

export const decodeTagEntitiesProcessor = (_: string, value: string): string => decodeEntities(value, tagEntities)

export const encodeAttributeEntitiesProcessor = (_: string, value: unknown): string =>
  typeof value === "string" ? encodeAttributeEntities(value) : (value as string)

export const encodeTagEntitiesProcessor = (_: string, value: unknown): string =>
  typeof value === "string" ? encodeTagEntities(value) : (value as string)
