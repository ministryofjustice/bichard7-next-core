const formatFixedLength = (item: string | number | undefined, length: number): string =>
  String(item ?? "")
    .slice(0, length)
    .padEnd(length, " ")

export default formatFixedLength
