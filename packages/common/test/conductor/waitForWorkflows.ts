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
  timeout?: number
  debug?: boolean
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
    if (params.debug) {
      console.log("Not enough workflows fetched")
      console.log(new Date())
      console.log(freeText)
      console.log(queryString)
      console.log(await conductorClient.workflowResource.search1())
    }

    throw new Error("Not enough workflows fetched")
  }

  if (params.debug) {
    console.log(response)
    console.log("Complete")
  }

  return response.results
}

const waitForWorkflows = (query: WorkflowSearchParams, timeout = 30000) =>
  promisePoller({
    taskFn: () => searchWorkflows(query),
    retries: timeout / 100,
    interval: 100 // milliseconds
  }).catch(() => {
    throw new Error("Could not find workflow")
  })

export default waitForWorkflows
