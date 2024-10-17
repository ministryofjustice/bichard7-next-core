export default (error: unknown): boolean => {
  if (error instanceof Error && error.name === "AggregateError" && error.stack && /(sql|postgres)/i.test(error.stack)) {
    return true
  }

  return false
}
