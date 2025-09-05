import { randomUUID } from "crypto"
import type { LedsMock, LedsMockOptions } from "../../../types/LedsMock"

const generateUpdate = (_code: string, options?: LedsMockOptions): LedsMock => {
  return {
    id: randomUUID(),
    request: {},
    response: {},
    count: options?.count,
    receivedRequests: []
  }
}

export default generateUpdate
