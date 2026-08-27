import { createWorkflowExecutor } from "@moj-bichard7/common/conductor/createWorkflowExecutor"

const startWorkflow = async (
  workflowName: string,
  requestBody: Record<string, unknown>,
  correlationId: string
): Promise<string> => {
  const workflowExecutor = await createWorkflowExecutor()
  return await workflowExecutor.startWorkflow({
    correlationId,
    input: requestBody,
    name: workflowName
  })
}

export default startWorkflow
