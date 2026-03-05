import type { AxiosError } from "axios"

export default class ApiError extends Error {
  constructor({ response, request }: AxiosError) {
    super()
    this.message = `${response?.status} ${response?.statusText} [${request?.method} ${request?.path}] ${JSON.stringify(response?.data, null, 2)}`
  }
}
