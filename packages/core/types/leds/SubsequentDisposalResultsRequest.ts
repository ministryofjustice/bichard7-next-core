import type z from "zod"

import type { subsequentDisposalResultsRequestSchema } from "../../schemas/leds/subsequentDisposalResultsRequest"

export type SubsequentDisposalResultsRequest = z.infer<typeof subsequentDisposalResultsRequestSchema>
