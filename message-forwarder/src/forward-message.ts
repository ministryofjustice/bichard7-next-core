import type MqGateway from "./MqGateway/MqGateway"

const destinationType = process.env.DESTINATION_TYPE ?? "mq"
const destination = process.env.DESTINATION ?? "HEARING_OUTCOME_INPUT_QUEUE"

const forwardMessage = async (message: string, mqGateway: MqGateway) => {
  if (destinationType === "mq") {
    await mqGateway.sendMessage(message, destination)
  } else if (destinationType === "s3") {
    //
  }
}

export default forwardMessage
