import type { Trigger } from "aws-sdk/clients/elasticbeanstalk"
import readline from "readline"
import getFile from "../../phase1/comparison/lib/getFile"
import { parseAhoXml } from "../../phase1/parse/parseAhoXml"
import type Exception from "../../phase1/types/Exception"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"

interface ComparisonFile {
  incomingMessage: string
  annotatedHearingOutcome: string
  triggers?: Trigger[]
  exceptions?: Exception[]
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

rl.on("line", (s3Path) => {
  getFile(s3Path, true).then((fileContents) => {
    const fileJson = JSON.parse(fileContents.toString()) as ComparisonFile

    const outputAho: AnnotatedHearingOutcome | Error = parseAhoXml(fileJson.annotatedHearingOutcome)

    if (outputAho instanceof Error) {
      console.error("Error parsing incoming message")
      process.exit(1)
    }

    const pncId = outputAho.PncQuery?.pncId
    const asn = outputAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber

    console.log([s3Path, pncId, asn].join("\t"))
  })
})
