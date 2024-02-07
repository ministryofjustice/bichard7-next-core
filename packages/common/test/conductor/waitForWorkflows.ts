import promisePoller from "promise-poller"
import createConductorClient from "../../conductor/createConductorClient"

const conductorClient = createConductorClient()

export type WorkflowSearchParams = {
  freeText?: string
  count?: number
  query: {
    workflowType?: string
    correlationId?: string
    status?: string
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

const waitForWorkflows = (query: WorkflowSearchParams) =>
  promisePoller({
    taskFn: () => searchWorkflows(query),
    retries: 300,
    interval: 100 // milliseconds
  }).catch(() => {
    throw new Error("Could not find workflow")
  })

export default waitForWorkflows
