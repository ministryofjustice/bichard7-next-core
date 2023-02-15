import type { TaskDef } from "conductor/src/types/TaskDef"
import fs from "fs"
import type ConductorGateway from "./ConductorGateway"

const commitHash = process.env.GIT_COMMIT_HASH
if (!commitHash) {
  throw new Error("Must specify $GIT_COMMIT_HASH")
}

class Task {
  private localTask: TaskDef

  constructor(filename: string, private conductor: ConductorGateway) {
    const fileContent = fs.readFileSync(filename)
    this.localTask = JSON.parse(fileContent.toString()) as TaskDef
  }

  async upsert(): Promise<void> {
    const remoteTask = await this.conductor.getTask(this.localTask.name)

    if (!remoteTask) {
      console.log(`Creating new task for '${this.localTask.name}'`)
      this.conductor.postTask(this.localTask)
    }

    if (remoteTask) {
      if (this.taskNeedsUpdating(remoteTask)) {
        console.log(`Updating task '${this.localTask.name}'`)
        this.conductor.postTask(this.localTask)
      } else {
        console.log(`Task '${this.localTask.name}' does not need updating`)
      }
    }
  }

  private taskNeedsUpdating(remoteTask: TaskDef): boolean {
    for (const key of Object.keys(this.localTask)) {
      const remoteValue = remoteTask[key as keyof TaskDef]
      const localValue = this.localTask[key as keyof TaskDef]

      if (remoteValue && JSON.stringify(remoteValue) !== JSON.stringify(localValue)) {
        return true
      }
    }
    return false
  }
}

export default Task
