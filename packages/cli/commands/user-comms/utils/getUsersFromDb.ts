import { env } from "../../../config"
import awsVault from "../../../utils/awsVault"

const getUsersFromDb = async (): Promise<string> => {
  const { aws } = env.PROD

  console.log("Fetching users from the database\n")

  return await awsVault.exec({
    awsProfile: aws.profile,
    command: `npx ts-node -T ./commands/user-comms/index.ts`
  })
}

export default getUsersFromDb
