import { WorkflowExecutor } from "@io-orkes/conductor-javascript"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"

const startWorkflow = async (
  workflowName: string,
  requestBody: Record<string, unknown>,
  correlationId: string
): Promise<string> => {
  const conductorClient = await createConductorClient()
  const executor = new WorkflowExecutor(conductorClient)

  return await executor.startWorkflow({
    correlationId,
    input: requestBody,
    name: workflowName
  })
}

export default startWorkflow
