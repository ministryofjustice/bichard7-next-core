import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import logger from "@moj-bichard7/common/utils/logger"
import MessageForwarder from "./MessageForwarder"
import createStompClient from "./createStompClient"

const stompClient = createStompClient()
const conductorClient = createConductorClient()

const messageForwarder = new MessageForwarder(stompClient, conductorClient)

const signalHandler = (signal: string) => {
  logger.info(`${signal} signal received.`)
  messageForwarder.stop()
}

process.on("SIGINT", signalHandler)
process.on("SIGTERM", signalHandler)
process.on("SIGQUIT", signalHandler)

process.on("exit", () => {
  logger.info("Exiting gracefully")
})

messageForwarder.start().then(() => logger.info("Message forwarder started"))
