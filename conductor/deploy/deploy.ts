import fs from "fs/promises"
import ConductorGateway from "./ConductorGateway"
import Task from "./Task"
import Workflow from "./Workflow"

const workflowDir = "./conductor/workflows"
const taskDir = "./conductor/tasks"

const conductor = new ConductorGateway({
  url: process.env.CONDUCTOR_URL ?? "http://localhost:5002",
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
}

main()
