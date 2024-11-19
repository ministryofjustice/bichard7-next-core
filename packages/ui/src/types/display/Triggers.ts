import type Trigger from "services/entities/Trigger"

type displayTriggerPickedFields =
  | "description"
  | "shortTriggerCode"
  | "status"
  | "triggerCode"
  | "triggerId"
  | "triggerItemIdentity"

export type DisplayTrigger = {
  createdAt: string
  resolvedAt?: string
} & Pick<Trigger, displayTriggerPickedFields>
