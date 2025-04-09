import { env } from "../../../config"
import awsVault from "../../../utils/awsVault"
import { confirm } from "@inquirer/prompts"

const getUsersFromDb = async (): Promise<string> => {
  const { aws } = env.PROD
  const confirmTemplateChoice = await confirm({ message: "Do you want to use this template?" })

  if (!confirmTemplateChoice) {
    process.exit(1)
  }

  console.log("Fetching users from the database\n")

  return await awsVault.exec({
    awsProfile: aws.profile,
    command: `npx ts-node -T ./commands/user-comms/utils/index.ts`
  })
}

export default getUsersFromDb
