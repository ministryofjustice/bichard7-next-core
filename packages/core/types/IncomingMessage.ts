import type { z } from "zod"
import type { incomingMessageSchema } from "../schemas/incomingMessage"

type IncomingMessage = z.infer<typeof incomingMessageSchema>

export default IncomingMessage
