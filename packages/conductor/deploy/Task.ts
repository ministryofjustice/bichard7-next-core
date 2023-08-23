import fs from "fs"
import { isMatch } from "lodash"
import type { TaskDef } from "src/types/TaskDef"
import type ConductorGateway from "deploy/ConductorGateway"

class Task {
  private localTask: TaskDef

  constructor(
    filename: string,
    private conductor: ConductorGateway
  ) {
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
    return !isMatch(remoteTask, this.localTask)
  }
}

export default Task
