import type Exception from "src/types/Exception"
import type { OffenceCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

export interface LookupResult {
  result?: OffenceCode
  exception?: Pick<Exception, "code"> & { subPath: string[] }
}
