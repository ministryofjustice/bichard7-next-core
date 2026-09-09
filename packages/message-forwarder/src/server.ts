import { createWorkflowExecutor } from "@moj-bichard7/common/conductor/createWorkflowExecutor"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import logger from "@moj-bichard7/common/utils/logger"
import postgres from "postgres"
import MessageForwarder from "./MessageForwarder"
import createStompClient from "./createStompClient"

async function startServer(): Promise<void> {
  const stompClient = createStompClient()
  const workflowExecutor = await createWorkflowExecutor()
  const databaseConfig = createDbConfig(true)
  const database = postgres(databaseConfig)
  const messageForwarder = new MessageForwarder(stompClient, workflowExecutor, database)

  const signalHandler = async (signal: string): Promise<void> => {
    logger.info(`${signal} signal received.`)
    await messageForwarder.stop()
  }

  process.on("SIGINT", signalHandler)
  process.on("SIGTERM", signalHandler)
  process.on("SIGQUIT", signalHandler)

  process.on("exit", () => {
    logger.info("Exiting gracefully")
  })

  await messageForwarder.start()
}

startServer().then(() => logger.info("Message forwarder started"))
