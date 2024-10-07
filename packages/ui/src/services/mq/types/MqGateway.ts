import type { PromiseResult } from "./Result"

export default interface MqGateway {
  execute(message: string, queueName: string): PromiseResult<void>
  dispose(): PromiseResult<void>
}
