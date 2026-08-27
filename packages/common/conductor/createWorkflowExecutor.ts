import { WorkflowExecutor } from "@io-orkes/conductor-javascript"

import createConductorClient from "./createConductorClient"

export async function createWorkflowExecutor(): Promise<WorkflowExecutor> {
  const conductorClient = await createConductorClient()
  return new WorkflowExecutor(conductorClient)
}
