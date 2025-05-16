import type { TaskDef, WorkflowDef } from "@io-orkes/conductor-javascript"
import type EventHandlerDef from "@moj-bichard7/common/conductor/types/EventHandlerDef"

import axios, { type AxiosResponse } from "axios"

type ConductorOptions = {
  password: string
  url: string
  username: string
}

class ConductorGateway {
  constructor(private conductorOptions: ConductorOptions) {}

  deleteEventHandler(name: string): Promise<void> {
    return axios.delete(`${this.conductorOptions.url}/event/${name}`, {
      auth: { password: this.conductorOptions.password, username: this.conductorOptions.username },
      headers: { "Content-Type": "application/json" }
    })
  }

  getEventHandler(event: string, name: string): Promise<EventHandlerDef | undefined> {
    return axios
      .get<EventHandlerDef[]>(`${this.conductorOptions.url}/event/${event}`, {
        auth: { password: this.conductorOptions.password, username: this.conductorOptions.username },
        validateStatus: (status: number) => status >= 200 && status < 500
      })
      .then((res) => {
        if (res.status === 200 && res.data.length > 0) {
          return res.data.filter((e) => e.name === name)[0]
        }

        return undefined
      })
  }

  getEventHandlers(): Promise<Error | EventHandlerDef[]> {
    return axios
      .get<EventHandlerDef[]>(`${this.conductorOptions.url}/event`, {
        auth: { password: this.conductorOptions.password, username: this.conductorOptions.username },
        validateStatus: (status: number) => status >= 200 && status < 500
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data
        }

        return Error(`Failed to get event handlers (${res.status})`)
      })
      .catch(() => Error("Failed to get event handlers"))
  }

  getTask(name: string): Promise<TaskDef | undefined> {
    return axios
      .get<TaskDef>(`${this.conductorOptions.url}/metadata/taskdefs/${name}`, {
        auth: { password: this.conductorOptions.password, username: this.conductorOptions.username },
        validateStatus: (status: number) => status >= 200 && status < 500
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data
        }

        return undefined
      })
  }

  getWorkflow(name: string): Promise<undefined | WorkflowDef> {
    return axios
      .get<WorkflowDef>(`${this.conductorOptions.url}/metadata/workflow/${name}`, {
        auth: { password: this.conductorOptions.password, username: this.conductorOptions.username },
        validateStatus: (status: number) => status >= 200 && status < 500
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data
        }

        return undefined
      })
  }

  postEventHandler(definition: EventHandlerDef): Promise<void> {
    return axios.post(`${this.conductorOptions.url}/event`, definition, {
      auth: { password: this.conductorOptions.password, username: this.conductorOptions.username },
      headers: { "Content-Type": "application/json" }
    })
  }

  postTask(definition: TaskDef): Promise<AxiosResponse | void> {
    return axios
      .post(`${this.conductorOptions.url}/metadata/taskdefs`, [definition], {
        auth: { password: this.conductorOptions.password, username: this.conductorOptions.username },
        headers: { "Content-Type": "application/json" }
      })
      .catch((e) => {
        console.error(e.response.data)
      })
  }

  putEventHandler(definition: EventHandlerDef): Promise<void> {
    return axios.put(`${this.conductorOptions.url}/event`, definition, {
      auth: { password: this.conductorOptions.password, username: this.conductorOptions.username },
      headers: { "Content-Type": "application/json" }
    })
  }

  putWorkflow(definition: WorkflowDef): Promise<void> {
    return axios
      .put(`${this.conductorOptions.url}/metadata/workflow`, [definition], {
        auth: { password: this.conductorOptions.password, username: this.conductorOptions.username },
        headers: { "Content-Type": "application/json" }
      })
      .catch((res) => {
        console.error(res.response.data)
        return res
      })
  }
}

export default ConductorGateway
