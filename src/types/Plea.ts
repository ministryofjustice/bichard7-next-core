import { z } from "zod"

export enum SpiPlea {
  Guilty = 1,
  NotGuilty = 2,
  NoPlea = 3,
  Consents = 4,
  Guilty6 = 6,
  Admits = 7,
  Denies = 8
}

export enum CjsPlea {
  Guilty = "G",
  NotGuilty = "NG",
  Consents = "CON",
  Admits = "ADM",
  Denies = "DEN",
  None = "NONE",
  Opposed = "OPP"
}

const spiPleaSchema = z.nativeEnum(SpiPlea)
const cjsPleaSchema = z.nativeEnum(CjsPlea)

export type SpiPleaType = z.infer<typeof spiPleaSchema>
export type CjsPleaType = z.infer<typeof cjsPleaSchema>
export { spiPleaSchema, cjsPleaSchema }
