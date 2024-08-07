import type { Trigger } from "aws-sdk/clients/elasticbeanstalk"
import readline from "readline"
import getFile from "../../comparison/lib/getFile"
import { parseAhoXml } from "../../lib/parse/parseAhoXml"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"

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
