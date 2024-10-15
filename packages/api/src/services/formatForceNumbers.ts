export default (forceNumbers?: string | null): number[] => {
  if (!forceNumbers) {
    return []
  }

  return forceNumbers
    .split(",")
    .filter((f) => /^\d+$/.test(f))
    .map((f) => Number(f))
}
