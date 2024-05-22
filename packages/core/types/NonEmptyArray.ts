type NonEmptyArray<T> = [T, ...T[]]

const isNonEmptyArray = <T>(arr: T[]): arr is NonEmptyArray<T> => {
  return arr.length > 0
}

export { NonEmptyArray, isNonEmptyArray }
