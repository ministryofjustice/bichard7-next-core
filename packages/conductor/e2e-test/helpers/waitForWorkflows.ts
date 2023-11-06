import axios from "axios"
import promisePoller from "promise-poller"

const conductorUrl = process.env.CONDUCTOR_URL ?? "http://localhost:5002"
const headers = {
  auth: {
    username: "bichard",
    password: "password"
  }
}

export type WorkflowSearchParams = {
  freeText: string
  query: {
    workflowType?: string
    status?: string
  }
}

const searchWorkflows = async (params: WorkflowSearchParams) => {
  const { freeText } = params
  const query = Object.entries(params.query)
    .map(([k, v]) => `${k}=${v}`)
    .join(" AND ")

  const response = await axios.get(
    `${conductorUrl}/api/workflow/search?freeText="${freeText}"&query="${query}"`,
    headers
  )

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
