import type * as z from "zod/v4"

import type { phase3ResultSchema } from "../schemas/phase3Result"

export enum Phase3ResultType {
  exceptions = "exceptions",
  success = "success"
}

type Phase3Result = z.infer<typeof phase3ResultSchema>

export default Phase3Result
