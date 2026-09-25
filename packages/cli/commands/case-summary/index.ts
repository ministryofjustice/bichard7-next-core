import { Argument, Command } from "commander"
import path from "path"
import type { Environment } from "../../config"
import { env } from "../../config"
import awsVault from "../../utils/awsVault"

export function caseSummary(): Command {
  return new Command("case-summary")
    .name("case-summary")
    .description(
      "Generate a case summary report containing the SPI hearing outcome, Bichard query details, and update details"
    )
    .usage("<message-id>")
    .addArgument(new Argument("<message-id>", "Bichard's message ID of the case"))
    .option("--redact-sensitive", "Removes the sensitive data from the summary")
    .option("--find-all-by-ptiurn", "Generates the summary for all cases sharing the same PTIURN as the passed message")
    .action(async (messageId, options) => {
      const scriptPath = path.resolve(__dirname, "../../../commands/case-summary/generateCaseSummary.ts")
      const { aws }: Environment = env.PROD
      await awsVault.exec({
        awsProfile: aws.profile,
        command: `npx tsx -e "require('${scriptPath}').default('${messageId}', { redactSensitiveData: ${options.redactSensitive}, usePtiUrnToFindAllCases: ${options.findAllByPtiurn} })"`,
        logExecution: true,
        streamOutput: true
      })
    })
}
