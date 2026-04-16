import type { TaskDef, WorkflowDef } from "@io-orkes/conductor-javascript"
import type EventHandlerDef from "@moj-bichard7/common/conductor/types/EventHandlerDef"

type ConductorOptions = {
  password: string
  url: string
  username: string
}

class ConductorGateway {
  constructor(private conductorOptions: ConductorOptions) {}

  async deleteEventHandler(name: string): Promise<void> {
    const res = await fetch(`${this.conductorOptions.url}/event/${name}`, {
      headers: this.getHeaders(),
      method: "DELETE"
    })

    if (!res.ok) {
      throw new Error(`Failed to delete event handler: HTTP ${res.status}`)
    }
  }

  async getEventHandler(event: string, name: string): Promise<EventHandlerDef | undefined> {
    const res = await fetch(`${this.conductorOptions.url}/event/${event}`, {
      headers: this.getHeaders()
    })

    if (res.status === 200) {
      const data = (await res.json()) as EventHandlerDef[]
      if (data.length > 0) {
        return data.find((e) => e.name === name)
      }
    }

    return undefined
  }

  async getEventHandlers(): Promise<Error | EventHandlerDef[]> {
    try {
      const res = await fetch(`${this.conductorOptions.url}/event`, {
        headers: this.getHeaders()
      })

      if (res.status === 200) {
        return (await res.json()) as EventHandlerDef[]
      }

      return new Error(`Failed to get event handlers (${res.status})`)
    } catch (error) {
      return new Error("Failed to get event handlers")
    }
  }

  async getTask(name: string): Promise<TaskDef | undefined> {
    const res = await fetch(`${this.conductorOptions.url}/metadata/taskdefs/${name}`, {
      headers: this.getHeaders()
    })

    if (res.status === 200) {
      return (await res.json()) as TaskDef
    }

    return undefined
  }

  async getWorkflow(name: string): Promise<undefined | WorkflowDef> {
    const res = await fetch(`${this.conductorOptions.url}/metadata/workflow/${name}`, {
      headers: this.getHeaders()
    })

    if (res.status === 200) {
      return (await res.json()) as WorkflowDef
    }

    return undefined
  }

  async postEventHandler(definition: EventHandlerDef): Promise<void> {
    const res = await fetch(`${this.conductorOptions.url}/event`, {
      body: JSON.stringify(definition),
      headers: this.getHeaders(),
      method: "POST"
    })

    if (!res.ok) {
      throw new Error(`Failed to post event handler: HTTP ${res.status}`)
    }
  }

  async postTask(definition: TaskDef): Promise<Response | void> {
    const res = await fetch(`${this.conductorOptions.url}/metadata/taskdefs`, {
      body: JSON.stringify([definition]),
      headers: this.getHeaders(),
      method: "POST"
    })

    if (!res.ok) {
      const errorData = await res.text().catch(() => "Unknown error")
      console.error(errorData)
      return
    }

    return res
  }

  async putEventHandler(definition: EventHandlerDef): Promise<void> {
    const res = await fetch(`${this.conductorOptions.url}/event`, {
      body: JSON.stringify(definition),
      headers: this.getHeaders(),
      method: "PUT"
    })

    if (!res.ok) {
      throw new Error(`Failed to put event handler: HTTP ${res.status}`)
    }
  }

  async putWorkflow(definition: WorkflowDef): Promise<void> {
    const res = await fetch(`${this.conductorOptions.url}/metadata/workflow`, {
      body: JSON.stringify([definition]),
      headers: this.getHeaders(),
      method: "PUT"
    })

    if (!res.ok) {
      const errorData = await res.text().catch(() => "Unknown error")
      console.error(errorData)
      throw new Error(`Failed to put workflow: HTTP ${res.status}`)
    }
  }

  private getHeaders(): HeadersInit {
    const credentials = Buffer.from(`${this.conductorOptions.username}:${this.conductorOptions.password}`).toString(
      "base64"
    )
    return {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json"
    }
  }
}

export default ConductorGateway
