export default (forceNumbers?: null | string): number[] =>
  forceNumbers
    ?.split(",")
    .filter((f) => /^\d+$/.test(f))
    .map((f) => Number(f)) ?? []
