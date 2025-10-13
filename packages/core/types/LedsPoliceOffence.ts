import type z from "zod"

import type ledsPoliceOffenceSchema from "../schemas/ledsPoliceOffence"

export type LedsPoliceOffence = z.infer<typeof ledsPoliceOffenceSchema>
