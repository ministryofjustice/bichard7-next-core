import type { z } from "zod"

import { isAfter, isBefore } from "date-fns"

import { dateLikeToDate } from "../../schemas/dateLikeToDate"

export const validateDateRange = (data: { fromDate: Date; toDate: Date }, ctx: z.RefinementCtx) => {
  if (isBefore(data.toDate, data.fromDate) || isAfter(data.toDate, new Date())) {
    ctx.addIssue({
      code: "custom",
      message: "Date range cannot be in the future or start after it ends",
      path: ["toDate"]
    })
  }
}

export const dateRangeShape = {
  fromDate: dateLikeToDate,
  toDate: dateLikeToDate
}
