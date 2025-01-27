import { Command } from "commander"
import path from "path"
import awsVault from "../utils/awsVault"
import { env, Environment } from "../config"

export function fetchImage(): Command {
  const command = new Command("fetch-image")

  command
    .description(`Fetch images from AWS Elastic Container Repository`)
    .usage("<image>")
    .argument("<image>", "The image you want to download from ECR")
    .action(async (image) => {
      const scriptPath = path.resolve(__dirname, "../../../../scripts/fetch-docker-image.sh")
      const { aws }: Environment = env.SHARED
      const command = `bash ${scriptPath} ${image}`
      await awsVault.exec(aws.profile, command)
    })

  return command
}
