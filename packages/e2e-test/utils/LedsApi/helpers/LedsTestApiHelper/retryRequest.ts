import type { AxiosError, AxiosResponse } from "axios"
import { HttpStatusCode } from "axios"
import { delay } from "../../../puppeteer-utils"

const MAX_ATTEMPTS = 5
const WAIT_BETWEEN_ATTEMPTS_IN_SECONDS = 10

const retryRequest = async <T extends AxiosResponse>(request: () => Promise<T>): Promise<T | AxiosError> => {
  let attempts = 0
  while (true) {
    const response = await request().catch((error: AxiosError) => error)
    if (response.status === HttpStatusCode.BadGateway) {
      if (++attempts > MAX_ATTEMPTS) {
        return response
      }

      console.log(`Bad Gateway 502 - Retrying (${attempts})...`)
      await delay(WAIT_BETWEEN_ATTEMPTS_IN_SECONDS)

      continue
    }

    return response
  }
}

export default retryRequest
