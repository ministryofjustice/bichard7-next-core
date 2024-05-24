export default function getDateFromComparisonFilePath(key: string): Date {
  const match = key.match(/.*(?<year>\d{4})\/(?<month>\d{2})\/(?<day>\d{2})\/(?<hour>\d{2})\/(?<minute>\d{2})\/[^\/]*$/)
  if (match) {
    return new Date(
      Number(match.groups?.year),
      Number(match.groups?.month) - 1,
      Number(match.groups?.day),
      Number(match.groups?.hour),
      Number(match.groups?.minute)
    )
  }

  return new Date()
}
