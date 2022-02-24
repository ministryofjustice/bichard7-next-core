import { z } from "zod"

export enum Plea {
  Guilty = 1,
  NotGuilty = 2,
  Consents = 4,
  Guilty6 = 6,
  Admits = 7,
  Denies = 8
}

const pleaSchema = z.nativeEnum(Plea)

export type PleaType = z.infer<typeof pleaSchema>
export { pleaSchema }
