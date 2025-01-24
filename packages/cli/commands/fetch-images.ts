import { bold, red } from "cli-color"
import { Command } from "commander"
import path from "path"
import { getEnvironment } from "../env"
import awsVault from "../utils/awsVault"

export function fetchImage(): Command {
  const command = new Command("fetch-image")

  command
    .description(
      `Fetch images from AWS Elastic Container Repository\nPlease note that Images are stored in the ${bold(red("Shared account"))}`
    )
    .usage("<image>")
    .argument("<image>", "The image you want to download from ECR")
    .action((image) => {
      const scriptPath = path.resolve(__dirname, "../../../../scripts/fetch-docker-image.sh")
      const profile = getEnvironment()

      if (profile.aws.profile !== "bichard7-shared") {
        console.error(`Please use the shared account environment flag "${bold("--shared")}" to fetch docker images`)
        return
      }

      const command = `bash ${scriptPath} ${image}`
      awsVault.exec(profile.aws.profile, command)
    })

  return command
}
