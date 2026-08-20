import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"

const startWorkflow = async (
  workflowName: string,
  requestBody: Record<string, unknown>,
  correlationId: string
): Promise<string> => {
  const conductorClient = await createConductorClient()
  return await conductorClient.workflowResource.startWorkflow1(workflowName, requestBody, undefined, correlationId)
}

export default startWorkflow
