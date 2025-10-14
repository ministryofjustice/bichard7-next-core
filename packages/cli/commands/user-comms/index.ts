import { bold } from "cli-color"
import { Command } from "commander"
import nunjucks from "nunjucks"
import type { Environment } from "../../config"
import { env } from "../../config"
import awsVault from "../../utils/awsVault"
import testDbConnection from "../../utils/testDbConnection"
import { pncMaintenance } from "./utils/pncMaintenance"
import { pncMaintenanceExtended } from "./utils/pncMaintenanceExtended"
import { prepareComms } from "./utils/prepareComms"
import { selectOutageType } from "./utils/selectOutageType"
import { selectTemplate } from "./utils/selectTemplate"
import sendUserComms from "./utils/sendUserComms"
import type { Content, Template } from "./utils/userCommsTypes"
import { templateTypes } from "./utils/userCommsTypes"

const WORKSPACE = process.env.WORKSPACE ?? "production"

nunjucks.configure({ autoescape: true })

export function userComms(): Command {
  const program = new Command("user-comms")

  program.description("A way to send group communications to all users").action(async () => {
    const { aws }: Environment = env.PROD
    const readerEndpoints: string[] = JSON.parse(
      await awsVault.exec({
        awsProfile: aws.profile,
        command: 'aws rds describe-db-clusters --query "DBClusters[*].ReaderEndpoint"'
      })
    )

    const dbHostname = readerEndpoints.filter((endpoint) =>
      endpoint?.startsWith(`cjse-${WORKSPACE}-bichard-7-aurora-cluster.cluster-ro-`)
    )?.[0]
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
      "PNC maintenance": templateTypes.PNC_MAINTENANCE,
      "PNC maintenance completed": templateTypes.PNC_MAINTENANCE_COMPLETED,
      "PNC maintenance extended": templateTypes.EXTENDED_PNC_MAINTENANCE,
      Outage: templateTypes.OUTAGE,
      "Outage Resolved": templateTypes.OUTAGE_RESOLVED
    }

    const templateData = templateMap[selectedTemplate]

    if (!templateData) {
      console.error("Invalid template selection")
      return
    }

    let inputedContent: Content | undefined = undefined
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
    }

    const { parsedUsers, templateContent } = await prepareComms(inputedContent, templateData, dbHostname)

    const updatedUsers = parsedUsers.map((user) => ({
      ...user,
      message: nunjucks.renderString(templateContent, { firstName: user.name, ...inputedContent })
    }))

    sendUserComms(updatedUsers, templateData)
  })

  return program
}
