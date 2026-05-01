import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import { delay } from "../utils/puppeteer-utils"

const client = createConductorClient()

const findRunningConductorWorkflowIds = async (): Promise<string[]> => {
  const searchResult = await client.workflowResource.search1(
    undefined,
    0,
    100,
    "startTime:DESC",
    undefined,
    "status='RUNNING'"
  )

  return searchResult.results?.map((workflow) => workflow.workflowId!) || []
}

export const areAllWorkflowsCompleted = async (): Promise<boolean> => {
  let runningWorkflowIds: string[] = []
  for (let counter = 0; counter < 5; counter++) {
    runningWorkflowIds = await findRunningConductorWorkflowIds()
    if (runningWorkflowIds.length === 0) {
      break
    }

    delay(2)
  }

  return runningWorkflowIds.length === 0
}

export const terminateConductorWorkflows = async () => {
  const idsToTerminate = await findRunningConductorWorkflowIds()
  await Promise.all(idsToTerminate.map((id) => client.workflowResource.terminate1(id, "Termination by test script")))
}
