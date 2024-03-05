import waitForWorkflows from "./waitForWorkflows"

export const waitForCompletedWorkflow = async (freeText: string, status: string = "COMPLETED", timeout = 60000) => {
  const [workflow] = await waitForWorkflows(
    {
      freeText,
      query: {
        workflowType: "bichard_phase_1",
        status
      }
    },
    timeout
  )
  return workflow
}
