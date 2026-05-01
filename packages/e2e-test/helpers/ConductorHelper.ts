import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"

const client = createConductorClient()

export const findRunningConductorWorkflowIds = async (): Promise<string[]> => {
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

export const terminateConductorWorkflows = async () => {
  const idsToTerminate = await findRunningConductorWorkflowIds()
  await Promise.all(idsToTerminate.map((id) => client.workflowResource.terminate1(id, "Termination by test script")))
}
