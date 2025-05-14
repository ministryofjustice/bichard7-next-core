import orderBy from "lodash.orderby"

import type { Trigger } from "../../types/Trigger"

const sortTriggers = (triggers: Trigger[]) => orderBy(triggers, ["code", "identifier"])

export default sortTriggers
