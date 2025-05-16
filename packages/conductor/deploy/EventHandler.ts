import type EventHandlerDef from "@moj-bichard7/common/conductor/types/EventHandlerDef"

import fs from "fs"
import isMatch from "lodash.ismatch"

import type ConductorGateway from "./ConductorGateway"

class EventHandler {
  name: string
  private localEventHandler: EventHandlerDef

  constructor(
    filename: string,
    private conductor: ConductorGateway
  ) {
    const fileContent = fs.readFileSync(filename)
    this.localEventHandler = JSON.parse(fileContent.toString()) as EventHandlerDef
    this.name = this.localEventHandler.name
  }

  static async delete(conductor: ConductorGateway, name: string): Promise<void> {
    await conductor.deleteEventHandler(name)

    console.log(`EventHandler '${name}' was deleted`)
  }

  static async getAll(conductor: ConductorGateway): Promise<Error | EventHandlerDef[]> {
    return await conductor.getEventHandlers()
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
