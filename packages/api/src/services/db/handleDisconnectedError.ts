export default (error: unknown): boolean => {
  return !!(
    error instanceof Error &&
    error.name === "AggregateError" &&
    error.stack &&
    /(sql|postgres)/i.test(error.stack)
  )
}
