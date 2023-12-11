import type { ConductorWorker } from "@io-orkes/conductor-javascript"

export const defaultConcurrency = (): number => (process.env.CONCURRENCY ? Number(process.env.CONCURRENCY) : 10)
export const defaultPollInterval = (): number => (process.env.POLL_INTERVAL ? Number(process.env.POLL_INTERVAL) : 100)

const getPollInterval = (taskName: string, taskPollInterval?: number): number => {
  const key = `POLL_INTERVAL_${taskName.toUpperCase()}`
  const envVar = process.env[key]
  const pollInterval = taskPollInterval ?? defaultPollInterval()
  return envVar ? Number(envVar) : pollInterval
}

const getTaskConcurrency = (taskName: string, taskConcurrency?: number): number => {
  const key = `CONCURRENCY_${taskName.toUpperCase()}`
  const envVar = process.env[key]
  const concurrency = taskConcurrency ?? defaultConcurrency()
  return envVar ? Number(envVar) : concurrency
}

export const configureWorker = (worker: ConductorWorker): ConductorWorker => ({
  ...worker,
  concurrency: getTaskConcurrency(worker.taskDefName, worker.concurrency),
  pollInterval: getPollInterval(worker.taskDefName, worker.pollInterval)
})
