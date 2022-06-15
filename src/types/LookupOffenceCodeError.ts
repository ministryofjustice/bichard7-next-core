export class LookupNationalOffenceCodeError extends Error {
  subPath: string[]

  constructor(val: string) {
    super()
    this.name = "LookupNationalOffenceCodeError"
    this.message = `National Lookup Failed: ${val}`
    this.subPath = ["CriminalProsecutionReference", "OffenceReason", "OffenceCode"]
  }
}

export class LookupLocalOffenceCodeError extends Error {
  subPath: string[]

  constructor(val: string) {
    super()
    this.name = "LookupLocalOffenceCodeError"
    this.message = `Local Lookup Failed: ${val}`
    this.subPath = ["CriminalProsecutionReference", "OffenceReason", "LocalOffenceCode", "OffenceCode"]
  }
}

export const isLookupOffenceCodeError = (
  result: unknown
): result is LookupNationalOffenceCodeError | LookupLocalOffenceCodeError =>
  result instanceof LookupNationalOffenceCodeError || result instanceof LookupLocalOffenceCodeError
