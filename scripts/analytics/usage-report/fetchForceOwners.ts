import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { FullAuditLogEvent } from "./common"
import getForceOwner from "./getForceOwner"

const fetchForceOwners = async (
  events: FullAuditLogEvent[],
  dynamo: DocumentClient,
  auditLogTableName: string
): Promise<Record<string, number>> => {
  const messageIdsSet = events.reduce((acc, event) => {
    acc.add(event._messageId)
    return acc
  }, new Set<string>())

  const messageIds = Array.from(messageIdsSet)
  const forceOwners: Record<string, number> = {}
  events
    .filter((event) => event.eventCode === EventCode.HearingOutcomeDetails)
    .forEach((event) => {
      const forceOwner = event.attributes?.["Force Owner"]?.toString().substring(0, 2) as string
      if (forceOwner) {
        forceOwners[event._messageId] = Number(forceOwner)
      }
    })
  const totalMessages = messageIds.length

  const worker = async () => {
    while (messageIds.length > 0) {
      const messageId = messageIds.shift()
      if (!messageId) {
        break
      }

      if (forceOwners[messageId]) {
        continue
      }

      const forceOwner = await getForceOwner(dynamo, auditLogTableName, messageId)
      if (isError(forceOwner)) {
        throw forceOwner
      }

      forceOwners[messageId] = Number(forceOwner)
    }
  }

  const reporter = async () => {
    while (messageIds.length > 0) {
      console.log(`Fetched force owner for ${totalMessages - messageIds.length} of ${totalMessages}`)

      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
  }

  await Promise.all(
    new Array(50)
      .fill(0)
      .map(() => worker())
      .concat(reporter())
  )

  console.log(`Fetched force owner for ${totalMessages - messageIds.length} of ${totalMessages}`)

  return forceOwners
}

export default fetchForceOwners
