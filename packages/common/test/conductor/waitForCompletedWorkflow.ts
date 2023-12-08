import waitForWorkflows from "./waitForWorkflows"

export const waitForCompletedWorkflow = async (s3TaskDataPath: string, status: string = "COMPLETED") => {
  const [workflow] = await waitForWorkflows({
    freeText: s3TaskDataPath,
    query: {
      workflowType: "bichard_process",
      status
    }
  })
  return workflow
}
