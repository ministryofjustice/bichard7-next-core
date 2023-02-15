import fs from "fs/promises"
import ConductorGateway from "./ConductorGateway"
import Workflow from "./Workflow"

const workflowDir = "./conductor/workflows"

const conductor = new ConductorGateway({
  url: process.env.CONDUCTOR_URL ?? "http://localhost:5002",
  username: process.env.CONDUCTOR_USERNAME ?? "bichard",
  password: process.env.CONDUCTOR_PASSWORD ?? "password"
})

const main = async () => {
  const workflowFilenames = await fs.readdir(workflowDir)
  const workflows = workflowFilenames.map((filename) => new Workflow(`${workflowDir}/${filename}`, conductor))

  const workflowPromises = workflows.map((workflow) => workflow.upsert())
  await Promise.all(workflowPromises)
}

main()
