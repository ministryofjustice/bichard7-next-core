import promisePoller from "promise-poller"

import createConductorClient from "../../conductor/createConductorClient"

const conductorClient = createConductorClient()

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

  const queryString = Object.entries(params.query)
    .map(([k, v]) => `${k}=${v}`)
    .join(" AND ")
  const query = queryString !== "" ? queryString : undefined

  const response = await conductorClient.workflowResource.search1(
    undefined,
    undefined,
    undefined,
    undefined,
    freeText,
    query
  )

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
