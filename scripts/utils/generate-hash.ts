/*
* This script generates hash for an incoming message in S3.
* 
* Run the following command to generate hash:
*
* aws-vault exec <profile> -- npx ts-node -T ./scripts/utils/generate-hash.ts s3://<bucket_name>/<s3_path>
*/

import getFileFromS3 from "../../packages/common/s3/getFileFromS3"
import { isError } from "../../packages/common/types/Result"
import { extractIncomingMessage, getDataStreamContent } from "../../packages/core/phase1/parse/transformSpiToAho/extractIncomingMessageData"
const crypto = require("crypto")

if (!process.argv.length) {
  console.error("S3 URI argument is required")
  process.exit(1)
}

const s3Uri = process.argv.slice(-1)?.[0]?.trim()
const s3ObjectInfo = s3Uri.match(/s3:\/\/(?<bucket>.*?)\/(?<file>.*)/)?.groups
if (!s3ObjectInfo?.bucket && !s3ObjectInfo?.file) {
  console.error("Couldn't extract the bucket name or file name")
  process.exit(1)
}

const run = async () => {
  const incomingMessage = await getFileFromS3(s3ObjectInfo.file, s3ObjectInfo.bucket, { region: "eu-west-2" })
  if (isError(incomingMessage)) {
    console.error("Couldn't get the S3 object content")
    process.exit(1)
  }

  const message = extractIncomingMessage(incomingMessage)
  if (isError(message)) {
    console.error("Couldn't extract message")
    process.exit(1)
  }

  const convertedXml = getDataStreamContent(message)
  const messageHash = crypto.createHash("sha256").update(convertedXml, "utf-8").digest("hex")
  
  console.log(messageHash)
}

run()
