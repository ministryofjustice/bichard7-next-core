import type * as z from "zod/v4"

import type { incomingMessageSchema } from "../schemas/incomingMessage"

type IncomingMessage = z.infer<typeof incomingMessageSchema>

export default IncomingMessage
