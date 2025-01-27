import { Command } from "commander"
import path from "path"
import awsVault from "../utils/awsVault"
import type { Environment } from "../config"
import { env } from "../config"

export function fetchImage(): Command {
  const command = new Command("fetch-image")

  command
    .description("Fetch images from AWS Elastic Container Repository")
    .usage("<image>")
    .argument("<image>", "The image you want to download from ECR")
    .action(async (image) => {
      const scriptPath = path.resolve(__dirname, "../../../../scripts/fetch-docker-image.sh")
      const { aws }: Environment = env.SHARED
      await awsVault.exec({
        awsProfile: aws.profile,
        command: `bash ${scriptPath} ${image}`,
        logExecution: true,
        streamOutput: true
      })
    })

  return command
}
