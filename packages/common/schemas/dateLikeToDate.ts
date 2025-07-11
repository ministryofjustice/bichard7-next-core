import * as z from "zod/v4"

const dateLike = z.union([z.number(), z.string(), z.date()])

export const dateLikeToDate = dateLike.pipe(z.coerce.date())
