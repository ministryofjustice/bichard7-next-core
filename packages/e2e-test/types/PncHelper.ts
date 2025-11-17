import type PncMock from "./PncMock"
import type PncRequestResponse from "./PncRequestResponse"

interface PncHelper {
  addMock(matchRegex: string, response: string, count?: number): Promise<string>
  getMock(id: string): Promise<PncMock>
  getRequests(): Promise<PncRequestResponse[]>
  getMocks(): Promise<void>
  clearMocks(): Promise<void>
  recordRequests(): Promise<void>
  recordMocks(): Promise<void>
  awaitMockRequest(id: string, timeout: number): Promise<PncMock | Error>
  setupRecord(): Promise<void>
  checkRecord(): Promise<boolean>
}

export default PncHelper
