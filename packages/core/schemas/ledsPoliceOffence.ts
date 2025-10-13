import { policeOffenceSchema } from "@moj-bichard7/common/schemas/policeQueryResult"
import z from "zod"

const ledsPoliceOffenceSchema = policeOffenceSchema.extend({
  offenceId: z.string()
})

export default ledsPoliceOffenceSchema
