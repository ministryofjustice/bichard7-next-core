export default (input: string): string => {
  const res = input.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (res && res[1] && res[2] && res[3]) {
    return `${res[3]}${res[2]}${res[1]}`.padEnd(12, "0")
  }

  throw new Error("Error formatting date")
}
