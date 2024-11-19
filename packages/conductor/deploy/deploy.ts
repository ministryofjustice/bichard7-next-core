import fs from "fs/promises"
import ConductorGateway from "./ConductorGateway"
import EventHandler from "./EventHandler"
import Task from "./Task"
import Workflow from "./Workflow"

const workflowDir = "./workflows"
const taskDir = "./tasks"
const eventHandlerDir = "./event-handlers"

const conductor = new ConductorGateway({
  url: process.env.CONDUCTOR_URL ?? "http://localhost:5002/api",
  username: process.env.CONDUCTOR_USERNAME ?? "bichard",
  password: process.env.CONDUCTOR_PASSWORD ?? "password"
})

const main = async () => {
  const taskFilenames = await fs.readdir(taskDir)
  const tasks = taskFilenames.map((filename) => new Task(`${taskDir}/${filename}`, conductor))

  const taskPromises = tasks.map((task) => task.upsert())
  await Promise.all(taskPromises)

  const workflowFilenames = await fs.readdir(workflowDir)
  const workflows = workflowFilenames.map((filename) => new Workflow(`${workflowDir}/${filename}`, conductor))

  const workflowPromises = workflows.map((workflow) => workflow.upsert())
  await Promise.all(workflowPromises)

  const eventHandlerFilenames = await fs.readdir(eventHandlerDir)
  const eventHandlers = eventHandlerFilenames.map(
    (filename) => new EventHandler(`${eventHandlerDir}/${filename}`, conductor)
  )

  const eventHandlerPromises = eventHandlers.map((eventHandler) => eventHandler.upsert())
  await Promise.all(eventHandlerPromises)
}

main()
