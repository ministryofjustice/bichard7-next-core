import type { PromiseResult } from "./Result"

export default interface MqGateway {
  dispose(): PromiseResult<void>
  execute(message: string, queueName: string): PromiseResult<void>
}
