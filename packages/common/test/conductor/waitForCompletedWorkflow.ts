import waitForWorkflows from "./waitForWorkflows"

export const waitForCompletedWorkflow = async (
  freeText: string,
  status: string = "COMPLETED",
  timeout = 30000,
  debug = false
) => {
  const [workflow] = await waitForWorkflows(
    {
      freeText,
      query: {
        workflowType: "bichard_phase_1",
        status
      },
      debug
    },
    timeout
  )
  return workflow
}
