import { WorkflowExecutor } from "@io-orkes/conductor-javascript"

import createConductorClient from "./createConductorClient"

export const createWorkflowExecutor = async (): Promise<WorkflowExecutor> => {
  const conductorClient = await createConductorClient()
  return new WorkflowExecutor(conductorClient)
}
