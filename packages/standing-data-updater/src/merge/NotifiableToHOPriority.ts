import type { OffenceCodeLookup } from "../types/OffenceCodeLookup"

const getValue = (offences: OffenceCodeLookup, code: string): boolean | undefined => {
  const match = offences[code]?.notifiableToHo
  return typeof match === "boolean" ? match : undefined
}

export class NotifiableToHOPriority {
  constructor(
    private currentOffenceCodes: OffenceCodeLookup,
    private pnldOffenceCodes: OffenceCodeLookup
  ) {}

  getHighestPriority(cjsCode: string): boolean {
    const defaultValue = false

    return getValue(this.pnldOffenceCodes, cjsCode) ?? getValue(this.currentOffenceCodes, cjsCode) ?? defaultValue
  }
}
