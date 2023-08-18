export const defaultConcurrency = process.env.CONCURRENCY ? Number(process.env.CONCURRENCY) : 1

const getTaskConcurrency = (taskName: string, taskConcurrencyDefault = defaultConcurrency): number => {
  const key = `CONCURRENCY_${taskName.toUpperCase()}`
  const envVar = process.env[key]
  return envVar ? Number(envVar) : taskConcurrencyDefault
}

export default getTaskConcurrency
