import type { z } from "zod"
import type { incomingMessageSchema } from "../phase1/schemas/incomingMessage"

type IncomingMessage = z.infer<typeof incomingMessageSchema>

export default IncomingMessage
