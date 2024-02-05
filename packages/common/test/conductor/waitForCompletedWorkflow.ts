import waitForWorkflows from "./waitForWorkflows"

export const waitForCompletedWorkflow = async (freeText: string, status: string = "COMPLETED") => {
  const [workflow] = await waitForWorkflows({
    freeText,
    query: {
      workflowType: "bichard_phase_1",
      status
    }
  })
  return workflow
}
