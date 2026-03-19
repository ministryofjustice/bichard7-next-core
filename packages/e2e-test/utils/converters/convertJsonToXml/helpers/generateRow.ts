import formatFixedLength from "./formatFixedLength"

type RowField = [val: string | undefined, len: number]

const formatRow = (tag: string, fields: RowField[]): string => {
  const content = fields.map(([val, len]) => formatFixedLength(val, len)).join("")

  return `<${tag}>${content}</${tag}>`
}

export default formatRow
