import type { WorkflowDef } from "@io-orkes/conductor-typescript"
import type EventHandlerDef from "@moj-bichard7/common/conductor/types/EventHandlerDef"
import type TaskDef from "@moj-bichard7/common/conductor/types/TaskDef"
import axios, { type AxiosResponse } from "axios"

type ConductorOptions = {
  url: string
  username: string
  password: string
}

class ConductorGateway {
  constructor(private conductorOptions: ConductorOptions) {}

  getWorkflow(name: string): Promise<WorkflowDef | undefined> {
    return axios
      .get<WorkflowDef>(`${this.conductorOptions.url}/api/metadata/workflow/${name}`, {
        auth: { username: this.conductorOptions.username, password: this.conductorOptions.password },
        validateStatus: (status: number) => status >= 200 && status < 500
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data
        }

        return undefined
      })
  }

  getTask(name: string): Promise<TaskDef | undefined> {
    return axios
      .get<TaskDef>(`${this.conductorOptions.url}/api/metadata/taskdefs/${name}`, {
        auth: { username: this.conductorOptions.username, password: this.conductorOptions.password },
        validateStatus: (status: number) => status >= 200 && status < 500
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data
        }

        return undefined
      })
  }

  getEventHandler(event: string, name: string): Promise<EventHandlerDef | undefined> {
    return axios
      .get<EventHandlerDef[]>(`${this.conductorOptions.url}/api/event/${event}`, {
        auth: { username: this.conductorOptions.username, password: this.conductorOptions.password },
        validateStatus: (status: number) => status >= 200 && status < 500
      })
      .then((res) => {
        if (res.status === 200 && res.data.length > 0) {
          return res.data.filter((e) => e.name === name)[0]
        }

        return undefined
      })
  }

  putWorkflow(definition: WorkflowDef): Promise<void> {
    return axios
      .put(`${this.conductorOptions.url}/api/metadata/workflow`, [definition], {
        auth: { username: this.conductorOptions.username, password: this.conductorOptions.password },
        headers: { "Content-Type": "application/json" }
      })
      .catch((res) => {
        console.error(res.response.data)
        return res
      })
  }

  postTask(definition: TaskDef): Promise<void | AxiosResponse> {
    return axios
      .post(`${this.conductorOptions.url}/api/metadata/taskdefs`, [definition], {
        auth: { username: this.conductorOptions.username, password: this.conductorOptions.password },
        headers: { "Content-Type": "application/json" }
      })
      .catch((e) => {
        console.error(e.response.data)
      })
  }

  postEventHandler(definition: EventHandlerDef): Promise<void> {
    return axios.post(`${this.conductorOptions.url}/api/event`, definition, {
      auth: { username: this.conductorOptions.username, password: this.conductorOptions.password },
      headers: { "Content-Type": "application/json" }
    })
  }

  putEventHandler(definition: EventHandlerDef): Promise<void> {
    return axios.put(`${this.conductorOptions.url}/api/event`, definition, {
      auth: { username: this.conductorOptions.username, password: this.conductorOptions.password },
      headers: { "Content-Type": "application/json" }
    })
  }
}

export default ConductorGateway
