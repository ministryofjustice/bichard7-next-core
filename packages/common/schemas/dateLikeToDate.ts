import { z } from "zod"

const dateLike = z.union([z.number(), z.string(), z.date()])

export const dateLikeToDate = dateLike.pipe(z.coerce.date())
