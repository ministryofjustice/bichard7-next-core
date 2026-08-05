import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import logger from "@moj-bichard7/common/utils/logger"
import postgres from "postgres"
import MessageForwarder from "./MessageForwarder"
import createStompClient from "./createStompClient"

const stompClient = createStompClient()
const conductorClient = createConductorClient()
const databasebConfig = createDbConfig(true)
const database = postgres(databasebConfig)

const messageForwarder = new MessageForwarder(stompClient, conductorClient, database)

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
