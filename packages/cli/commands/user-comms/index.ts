import { Command } from "commander"
import { prepareComms } from "./utils/prepareComms"
import { selectTemplate } from "./utils/selectTemplate"
import { selectOutageType } from "./utils/selectOutageType"
import type { Content, Template } from "./utils/userCommsTypes"
import { templateTypes } from "./utils/userCommsTypes"
import { pncMaintenance } from "./utils/pncMaintenance"
import { pncMaintenanceExtended } from "./utils/pncMaintenanceExtended"
import nunjucks from "nunjucks"
import sendUserComms from "./utils/sendUserComms"
import awsVault from "../../utils/awsVault"
import { env, Environment } from "../../config"
import { bold } from "cli-color"
import testDbConnection from "../../utils/testDbConnection"

const WORKSPACE = process.env.WORKSPACE ?? "production"

nunjucks.configure({ autoescape: true })

export function userComms(): Command {
  const program = new Command("user-comms")

  program.description("A way to send group communications to all users").action(async () => {
    const { aws }: Environment = env.PROD

    const { DBClusters: dbClusters } = JSON.parse(
      await awsVault.exec({ awsProfile: aws.profile, command: "aws rds describe-db-clusters" })
    )

    const dbHostname = dbClusters
      .map((cluster) => cluster.ReaderEndpoint)
      .filter((endpoint) => endpoint?.startsWith(`cjse-${WORKSPACE}-bichard-7-aurora-cluster.cluster-ro-`))?.[0]

    const isConnectedToDb = await testDbConnection(dbHostname)
    if (!isConnectedToDb) {
      console.error(
        bold(
          "Failed to connect to database - make sure you're connected to the correct VPN and that dev SGs have been applied."
        )
      )

      return
    }

    const selectedTemplate = await selectTemplate()

    const templateMap: Record<string, Template> = {
      "PNC maintenance": templateTypes.PNCMAINTENANCE,
      "PNC maintenance extended": templateTypes.EXTENDEDPNCMAINTENANCE,
      Outage: templateTypes.OUTAGE,
      "Outage Resolved": templateTypes.OUTAGERESOLVED
    }

    const templateData = templateMap[selectedTemplate]

    if (!templateData) {
      console.error("Invalid template selection")
      return
    }

    let inputedContent: Content
    switch (selectedTemplate) {
      case "Outage":
        inputedContent = await selectOutageType(selectedTemplate)
        templateData.templateTitle = `Unexpected ${inputedContent.outageType} Outage`
        break
      case "Outage Resolved":
        inputedContent = await selectOutageType(selectedTemplate)
        templateData.templateTitle = `Unexpected ${inputedContent.outageType} Outage Resolved`
        break
      case "PNC maintenance":
        inputedContent = await pncMaintenance()
        break
      case "PNC maintenance extended":
        inputedContent = await pncMaintenanceExtended()
        break
      default:
        console.error("Invalid template selection")
        return
    }

    const { parsedUsers, templateContent } = await prepareComms(inputedContent, templateData)

    const updatedUsers = parsedUsers.map((user) => ({
      ...user,
      message: nunjucks.renderString(templateContent, { firstName: user.name, ...inputedContent })
    }))

    sendUserComms(updatedUsers, templateData)
  })

  return program
}
