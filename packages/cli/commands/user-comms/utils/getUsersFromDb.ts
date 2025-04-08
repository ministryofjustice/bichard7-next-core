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

  console.log(aws.dbPrefix)
  const getPostgressPassword = `aws ssm get-parameter --name ${aws.dbPrefix} --with-decryption --query "Parameter.Value" --output text`

  const dbPassword = await awsVault.exec({
    awsProfile: aws.profile,
    command: getPostgressPassword
  })

  return await awsVault.exec({
    awsProfile: aws.profile,
    command: `sh -c DB_PASSWORD="${dbPassword.trim()} npx ts-node -T ./commands/user-comms/utils/index.ts"`
  })
}

export default getUsersFromDb
