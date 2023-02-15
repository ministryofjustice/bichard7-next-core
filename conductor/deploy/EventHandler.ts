import type { EventHandlerDef } from "conductor/src/types/EventHandlerDef"
import fs from "fs"
import { isMatch } from "lodash"
import type ConductorGateway from "./ConductorGateway"

const commitHash = process.env.GIT_COMMIT_HASH
if (!commitHash) {
  throw new Error("Must specify $GIT_COMMIT_HASH")
}

class EventHandler {
  private localEventHandler: EventHandlerDef

  constructor(filename: string, private conductor: ConductorGateway) {
    const fileContent = fs.readFileSync(filename)
    this.localEventHandler = JSON.parse(fileContent.toString()) as EventHandlerDef
  }

  async upsert(): Promise<void> {
    const remoteEventHandler = await this.conductor.getEventHandler(
      this.localEventHandler.event,
      this.localEventHandler.name
    )

    if (!remoteEventHandler) {
      console.log(`Creating new EventHandler for '${this.localEventHandler.name}'`)
      this.conductor.postEventHandler(this.localEventHandler)
    }

    if (remoteEventHandler) {
      if (this.eventHandlerNeedsUpdating(remoteEventHandler)) {
        console.log(`Updating EventHandler '${this.localEventHandler.name}'`)
        this.conductor.putEventHandler(this.localEventHandler)
      } else {
        console.log(`EventHandler '${this.localEventHandler.name}' does not need updating`)
      }
    }
  }

  private eventHandlerNeedsUpdating(remoteEventHandler: EventHandlerDef): boolean {
    return !isMatch(remoteEventHandler, this.localEventHandler)
  }
}

export default EventHandler
