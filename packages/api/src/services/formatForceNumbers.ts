export default (forceNumbers: string): number[] =>
  forceNumbers
    .split(",")
    .filter((f) => /^\d+$/.test(f))
    .map((f) => Number(f))
