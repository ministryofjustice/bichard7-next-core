import type { WorkflowDef } from "@io-orkes/conductor-typescript"
import crypto from "crypto"
import fs from "fs"
import type ConductorGateway from "./ConductorGateway"

const commitHash = process.env.GIT_COMMIT_HASH
if (!commitHash) {
  throw new Error("Must specify $GIT_COMMIT_HASH")
}

const hashFile = (fileContent: Buffer): string => {
  const hashSum = crypto.createHash("sha256")
  hashSum.update(fileContent)
  return hashSum.digest("hex").substring(0, 16)
}

class Workflow {
  private localWorkflow: WorkflowDef

  private localWorkflowHash: string

  constructor(filename: string, private conductor: ConductorGateway) {
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
    return `Workflow File: ${this.localWorkflowHash}, Commit Hash: ${commitHash}`
  }

  private workflowNeedsUpdating(remoteWorkflow: WorkflowDef): boolean {
    return !remoteWorkflow.updatedBy?.includes(this.localWorkflowHash)
  }
}

export default Workflow
