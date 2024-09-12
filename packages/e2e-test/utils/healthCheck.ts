import type { AxiosRequestConfig } from "axios"
import axios from "axios"
import https from "https"
import Poller from "./Poller"

type HealthCheckData = {
  name: string
  healthy: boolean
}

export default () => {
  const uiScheme = process.env.UI_SCHEME || "https"
  const uiHost = process.env.UI_HOST || "localhost"
  const uiPort = process.env.UI_PORT || "4443"

  const fetchHealthcheck = async () => {
    const axiosOptions: AxiosRequestConfig = { validateStatus: () => true }
    if (uiScheme.toLowerCase() === "https") {
      axiosOptions.httpsAgent = new https.Agent({
        rejectUnauthorized: false
      })
    }

    const resp = await axios.get(`${uiScheme}://${uiHost}:${uiPort}/bichard-ui/Connectivity`, axiosOptions)
    return resp.data as Record<string, HealthCheckData>
  }

  const checkHealthcheck = (checkData: Record<string, HealthCheckData>) => {
    const failedSystems = Object.values(checkData)
      .reduce((acc: HealthCheckData[], val) => acc.concat(val), [])
      .filter((system) => !system.healthy)
      .map((system) => system.name)
    if (failedSystems.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`Healthcheck failed. Unhealthy systems: ${failedSystems.join(", ")}`)
    } else {
      // eslint-disable-next-line no-console
      console.log("Healthcheck passed")
    }

    return failedSystems.length === 0
  }

  return new Poller(fetchHealthcheck)
    .poll({
      timeout: 60000,
      delay: 1000,
      name: "Health check",
      condition: checkHealthcheck
    })
    .then(() => true)
    .catch(() => {
      throw new Error("Healthcheck failed")
    })
}
