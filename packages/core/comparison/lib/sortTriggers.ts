import orderBy from "lodash.orderby"
import type { Trigger } from "../../types/Trigger"

export const sortTriggers = (triggers: Trigger[]): Trigger[] => orderBy(triggers, ["code", "offenceSequenceNumber"])
