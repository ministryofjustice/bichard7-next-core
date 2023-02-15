import type { WorkflowDef } from "@io-orkes/conductor-typescript"
import axios from "axios"
import type { TaskDef } from "conductor/src/types/TaskDef"

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

  putWorkflow(definition: WorkflowDef): Promise<void> {
    return axios.put(`${this.conductorOptions.url}/api/metadata/workflow`, [definition], {
      auth: { username: this.conductorOptions.username, password: this.conductorOptions.password },
      headers: { "Content-Type": "application/json" }
    })
  }

  postTask(definition: TaskDef): Promise<void> {
    return axios.post(`${this.conductorOptions.url}/api/metadata/taskdefs`, [definition], {
      auth: { username: this.conductorOptions.username, password: this.conductorOptions.password },
      headers: { "Content-Type": "application/json" }
    })
  }
}

export default ConductorGateway
