export const toISODate = (date: Date): string => date.toISOString().substring(0, 10)

export const toPNCDate = (date: Date): string => {
  const isoDate = toISODate(date)
  return `${isoDate.substring(8, 10)}${isoDate.substring(5, 7)}${isoDate.substring(0, 4)}`
}
