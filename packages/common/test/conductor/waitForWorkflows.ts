import axios from "axios"
import promisePoller from "promise-poller"
import createConductorConfig from "../../conductor/createConductorConfig"

const conductorUrl = process.env.CONDUCTOR_URL ?? "http://localhost:5002"
const { username, password } = createConductorConfig()
const headers = { auth: { username, password } }

export type WorkflowSearchParams = {
  freeText?: string
  query: {
    workflowType?: string
    correlationId?: string
    status?: string
  }
}

const searchWorkflows = async (params: WorkflowSearchParams) => {
  const queryChunks = []

  const { freeText } = params
  if (freeText) {
    queryChunks.push(`freeText="${freeText}`)
  }

  const queryString = Object.entries(params.query)
    .map(([k, v]) => `${k}=${v}`)
    .join(" AND ")
  if (queryString !== "") {
    queryChunks.push(`query="${queryString}`)
  }

  const query = queryChunks.join("&")

  const response = await axios.get(`${conductorUrl}/api/workflow/search?${query}`, headers)

  if (response.data.totalHits === 0) {
    throw new Error("No workflows fetched")
  }
  return response.data.results
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
