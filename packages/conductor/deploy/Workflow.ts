import type { WorkflowDef } from "@io-orkes/conductor-typescript"
import fs from "fs"
import type ConductorGateway from "./ConductorGateway"
import { hashFile } from "./utils"

const commitHash = process.env.GIT_COMMIT_HASH
if (!commitHash) {
  throw new Error("Must specify $GIT_COMMIT_HASH")
}

class Workflow {
  private localWorkflow: WorkflowDef

  private localWorkflowHash: string

  constructor(
    filename: string,
    private conductor: ConductorGateway
  ) {
    const fileContent = fs.readFileSync(filename)
    this.localWorkflow = JSON.parse(fileContent.toString()) as WorkflowDef
    this.localWorkflowHash = hashFile(fileContent)
  }

  async upsert(): Promise<void> {
    const remoteWorkflow = await this.conductor.getWorkflow(this.localWorkflow.name)
    this.localWorkflow.updatedBy = this.getUpdatedBy()

    if (!remoteWorkflow) {
      console.log(`Creating new workflow for '${this.localWorkflow.name}'`)
      this.localWorkflow.version = 1
      this.conductor.putWorkflow(this.localWorkflow)
    }

    if (remoteWorkflow) {
      if (this.workflowNeedsUpdating(remoteWorkflow)) {
        this.localWorkflow.version = remoteWorkflow.version + 1
        console.log(`Updating workflow '${this.localWorkflow.name}' to version ${this.localWorkflow.version}`)
        this.conductor.putWorkflow(this.localWorkflow)
      } else {
        console.log(`Workflow '${this.localWorkflow.name}' does not need updating`)
      }
    }
  }

  private getUpdatedBy(): string {
    return `Workflow file: ${this.localWorkflowHash}, Commit hash: ${commitHash}`
  }

  private workflowNeedsUpdating(remoteWorkflow: WorkflowDef): boolean {
    return !remoteWorkflow.updatedBy?.includes(this.localWorkflowHash)
  }
}

export default Workflow
