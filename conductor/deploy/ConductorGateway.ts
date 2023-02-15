import type { WorkflowDef } from "@io-orkes/conductor-typescript"
import axios from "axios"

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

  putWorkflow(definition: WorkflowDef): Promise<void> {
    return axios.put(`${this.conductorOptions.url}/api/metadata/workflow`, [definition], {
      auth: { username: this.conductorOptions.username, password: this.conductorOptions.password },
      headers: { "Content-Type": "application/json" }
    })
  }
}

export default ConductorGateway
