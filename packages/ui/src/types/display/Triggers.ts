import Trigger from "services/entities/Trigger"

type displayTriggerPickedFields =
  | "description"
  | "shortTriggerCode"
  | "status"
  | "triggerCode"
  | "triggerId"
  | "triggerItemIdentity"

export type DisplayTrigger = Pick<Trigger, displayTriggerPickedFields> & {
  createdAt: string
  resolvedAt?: string
}
