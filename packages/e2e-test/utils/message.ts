import { randomUUID } from "crypto"
import { expect } from "expect"
import fs from "fs"
import path from "path"
import { checkAuditLogRecordExists } from "./auditLogging"
import convertMessageToNewFormat from "./convertMessageToNewFormat"
import { isError } from "./isError"
import { replaceAllTags } from "./tagProcessing"
import type Bichard from "./world"

const uploadToS3 = async (context: Bichard, message: string, correlationId: string) => {
  const fileName = await context.incomingMessageBucket.upload(message, correlationId)

  if (isError(fileName)) {
    throw fileName
  }
}

const sendMsg = async function (world: Bichard, messagePath: string) {
  const rawMessage = await fs.promises.readFile(messagePath)
  const correlationId = `CID-${randomUUID()}`
  let messageData = rawMessage.toString().replace("EXTERNAL_CORRELATION_ID", correlationId)
  world.setCorrelationId(correlationId)
  if (world.config.parallel) {
    messageData = replaceAllTags(world, messageData, "DC:")
  }

  if (world.config.messageEntryPoint === "s3") {
    messageData = convertMessageToNewFormat(messageData)
    const uploadResult = await uploadToS3(world, messageData, correlationId).catch((e) => e)
    expect(isError(uploadResult)).toBeFalsy()
    const checkEventResult = await checkAuditLogRecordExists(world, correlationId)
    expect(isError(checkEventResult)).toBeFalsy()
    return Promise.resolve()
  }

  if (world.config.messageEntryPoint === "mq") {
    await world.auditLogApi.createAuditLogMessage(correlationId)
    return world.mq.sendMessage("COURT_RESULT_INPUT_QUEUE", messageData)
  }

  throw new Error(`Invalid value for MESSAGE_ENTRY_POINT: ${world.config.messageEntryPoint}`)
}

export const sendMessageForTest = function (this: Bichard, messageFileName: string) {
  const specFolder = path.dirname(this.featureUri)
  const messagePath = `${specFolder}/${messageFileName}.xml`
  return sendMsg(this, messagePath)
}
