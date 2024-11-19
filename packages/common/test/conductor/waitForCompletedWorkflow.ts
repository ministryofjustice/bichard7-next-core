import waitForWorkflows from "./waitForWorkflows"

export const waitForCompletedWorkflow = async (
  freeText: string,
  status = "COMPLETED",
  timeout = 60000,
  workflowType = "bichard_phase_1"
) => {
  const [workflow] = await waitForWorkflows(
    {
      freeText,
      query: {
        workflowType,
        status
      }
    },
    timeout
  )
  return workflow
}
