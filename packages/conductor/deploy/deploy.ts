import fs from "fs/promises"

import ConductorGateway from "./ConductorGateway"
import EventHandler from "./EventHandler"
import Task from "./Task"
import Workflow from "./Workflow"

const workflowDir = "./workflows"
const taskDir = "./tasks"
const eventHandlerDir = "./event-handlers"

const conductor = new ConductorGateway({
  password: process.env.CONDUCTOR_PASSWORD ?? "password",
  url: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api",
  username: process.env.CONDUCTOR_USERNAME ?? "bichard"
})

const incomingMessageSqsQueue = process.env.INCOMING_MESSAGE_SQS_QUEUE

const main = async () => {
  const taskFilenames = await fs.readdir(taskDir)
  for (const filename of taskFilenames) {
    const task = new Task(`${taskDir}/${filename}`, conductor)
    await task.upsert()
  }

  const workflowFilenames = await fs.readdir(workflowDir)
  for (const filename of workflowFilenames) {
    const workflow = new Workflow(`${workflowDir}/${filename}`, conductor)
    await workflow.upsert()
  }

  const eventHandlerFilenames = await fs.readdir(eventHandlerDir)
  const eventHandlers = eventHandlerFilenames.map(
    (filename) => new EventHandler(`${eventHandlerDir}/${filename}`, conductor, incomingMessageSqsQueue)
  )
  for (const eventHandler of eventHandlers) {
    await eventHandler.upsert()
  }

  const existingEventHandlers = await EventHandler.getAll(conductor)
  if (existingEventHandlers instanceof Error) {
    console.error(existingEventHandlers.message)
    process.exit(1)
  }

  const registeredNames = new Set(eventHandlers.map((e) => e.name))
  const eventHandlersToRemove = existingEventHandlers.filter(
    (existingEventHandler) => !registeredNames.has(existingEventHandler.name)
  )
  for (const eventHandler of eventHandlersToRemove) {
    await EventHandler.delete(conductor, eventHandler.name)
  }
}

main()
