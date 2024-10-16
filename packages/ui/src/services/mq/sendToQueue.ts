import { createMqConfig, StompitMqGateway } from "."
import { isError } from "types/Result"

interface SendToQueueInput {
  messageXml: string
  queueName: string
}

const config = createMqConfig()
const gateway = new StompitMqGateway(config)

export default async function sendToQueue({ messageXml, queueName }: SendToQueueInput): Promise<void | Error> {
  const result = await gateway.execute(messageXml, queueName)

  if (isError(result)) {
    return result
  }

  return
}
