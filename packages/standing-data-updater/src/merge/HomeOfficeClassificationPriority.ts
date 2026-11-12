import type { OffenceCodeLookup } from "../types/OffenceCodeLookup"

const defaultValue = "000/00"

const getValue = (offences: OffenceCodeLookup, code: string): string | undefined => {
  const match = offences[code]?.homeOfficeClassification
  if (!match || match === defaultValue) {
    return undefined
  }

  return match
}

export class HomeOfficeClassificationPriority {
  constructor(
    private currentOffenceCodes: OffenceCodeLookup,
    private pnldOffenceCodes: OffenceCodeLookup
  ) {}

  getHighestPriority(cjsCode: string): string {
    return getValue(this.pnldOffenceCodes, cjsCode) ?? getValue(this.currentOffenceCodes, cjsCode) ?? defaultValue
  }
}
