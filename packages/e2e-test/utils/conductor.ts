import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import axios from "axios"
import { expect } from "expect"
import promisePoller from "promise-poller"
import conductorConfig from "../helpers/ConductorHelper"
import type Bichard from "./world"

const { CONDUCTOR_URL, CONDUCTOR_PASSWORD, CONDUCTOR_USER } = conductorConfig

const base64 = (input: string) => Buffer.from(input).toString("base64")

const basicAuthenticationHeaders = () => ({
  Authorization: `Basic ${base64(`${CONDUCTOR_USER}:${CONDUCTOR_PASSWORD}`)}`
})

//TODO: Use the conductor library so we get the types too
const conductorApi = axios.create({
  headers: basicAuthenticationHeaders()
})

const fetchCompletedBichardProcessWorkflow = async (workflowId: string) => {
  const workflow = await conductorApi
    .get(`${CONDUCTOR_URL}/api/workflow/${workflowId}`)
    .then((response) => response.data)
    .catch((e) => console.log(e))

  if (workflow.status !== "COMPLETED") {
    throw new Error(`No completed bichard_process workflow with id ${workflowId}`)
  }

  return workflow
}

export const checkConductorWorkflowCompleted = async function (world: Bichard) {
  const incomingMessageHandlerWorkflowSearch = await conductorApi
    .get(
      `${CONDUCTOR_URL}/api/workflow/search?query=%22workflowType=incoming_message_handler%20AND%20status=COMPLETED%22`
    )
    .then((response) => response.data)
    .catch((e) => console.log(e))

  expect(incomingMessageHandlerWorkflowSearch).toBeDefined()

  const incomingMessageHandlerWorkflowSummary = incomingMessageHandlerWorkflowSearch.results.find(
    (r: { input: (string | null)[] }) => r.input.includes(world.currentCorrelationId)
  )

  expect(incomingMessageHandlerWorkflowSummary).toBeDefined()

  const incomingMessageHandlerWorkflow = await conductorApi
    .get(`${CONDUCTOR_URL}/api/workflow/${incomingMessageHandlerWorkflowSummary.workflowId}`)
    .then((response) => response.data)
    .catch((e) => console.log(e))

  expect(incomingMessageHandlerWorkflow).toBeDefined()

  const beginProcessingTask = incomingMessageHandlerWorkflow.tasks.find(
    (t: { referenceTaskName: string }) => t.referenceTaskName === "begin_processing"
  )

  expect(beginProcessingTask).toBeDefined()

  const workflow = await promisePoller({
    taskFn: () => fetchCompletedBichardProcessWorkflow(beginProcessingTask.outputData.workflowId),
    interval: 100,
    retries: 900
  }).catch((e) => e)

  expect(workflow.status).toEqual("COMPLETED")
}

export const terminateConductorWorkflows = async () => {
  const client = createConductorClient()
  const searchResult = await client.workflowResource.search1(
    undefined,
    0,
    100,
    "startTime:DESC",
    undefined,
    "status='RUNNING'"
  )
  const idsToTerminate = searchResult.results?.map((workflow) => workflow.workflowId!) || []
  await Promise.all(idsToTerminate.map((id) => client.workflowResource.terminate1(id, "Termination by test script")))
}
