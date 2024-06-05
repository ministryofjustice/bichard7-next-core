import orderBy from "lodash.orderby"
import type { Trigger } from "../../phase1/types/Trigger"

export const sortTriggers = (triggers: Trigger[]): Trigger[] => orderBy(triggers, ["code", "offenceSequenceNumber"])
