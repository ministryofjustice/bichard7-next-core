import type { z } from "zod"
import type { phase3ResultSchema } from "../schemas/phase3Result"

export enum Phase3ResultType {
  success = "success",
  exceptions = "exceptions"
}

type Phase3Result = z.infer<typeof phase3ResultSchema>

export default Phase3Result
