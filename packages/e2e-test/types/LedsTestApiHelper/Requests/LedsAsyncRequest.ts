export type PendingRequest = { requestId: string }
export type PendingRequestResponse = {
  status: string
  steps: {
    type: string
    completedAt: string
    relatedUUID?: {
      type: string
      uuid: string
    }
  }[]
  associatedValues: { type: string; value: string }[]
}
