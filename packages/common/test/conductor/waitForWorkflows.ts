import promisePoller from "promise-poller"

import { createWorkflowExecutor } from "../../conductor/createWorkflowExecutor"

export type WorkflowSearchParams = {
  count?: number
  freeText?: string
  query: {
    correlationId?: string
    status?: string
    workflowType?: string
  }
}

const searchWorkflows = async (params: WorkflowSearchParams) => {
  const expectedHits = params.count ?? 1

  const { freeText } = params

  const query = Object.entries(params.query)
    .map(([k, v]) => `${k}=${v}`)
    .join(" AND ")

  const workflowExecutor = await createWorkflowExecutor()
  const response = await workflowExecutor.search(0, 100, query, freeText ?? "")

  if (!response.results || response.results.length < expectedHits) {
    throw new Error("Not enough workflows fetched")
  }

  return response.results
}

const waitForWorkflows = (query: WorkflowSearchParams, timeout = 60000) =>
  promisePoller({
    interval: 100, // milliseconds
    retries: timeout / 100,
    taskFn: () => searchWorkflows(query)
  }).catch(() => {
    throw new Error("Could not find workflow")
  })

export default waitForWorkflows
