import type { OffenceCodeLookup } from "../types/OffenceCodeLookup"

const getValue = (offences: OffenceCodeLookup, code: string): boolean | undefined => {
  const match = offences[code]?.recordableOnPnc
  return typeof match === "boolean" ? match : undefined
}

export class RecordableOnPncPriority {
  constructor(
    private currentOffenceCodes: OffenceCodeLookup,
    private pnldOffenceCodes: OffenceCodeLookup,
    private pncOffenceCodes: OffenceCodeLookup
  ) {}

  getHighestPriority(cjsCode: string): boolean {
    return (
      getValue(this.pncOffenceCodes, cjsCode) ??
      getValue(this.pnldOffenceCodes, cjsCode) ??
      getValue(this.currentOffenceCodes, cjsCode) ??
      false
    )
  }
}
