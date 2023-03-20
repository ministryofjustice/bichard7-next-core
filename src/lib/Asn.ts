const intOrString = (input: string): string => (input.match(/^\d*$/) ? input : "")

class Asn {
  public year: string

  public force: string

  public unit: string

  public system: string

  public sequence: number

  constructor(asn: string) {
    this.year = asn.slice(0, 2)
    this.force = asn.slice(2, 4)
    this.unit = asn.slice(4, 6)
    this.system = asn.slice(6, 8)
    this.sequence = parseInt(asn.slice(8), 10)
  }

  checkCharacter(): string | undefined {
    try {
      const sequence = this.sequence.toString().padStart(11, "0")
      const number = `${intOrString(this.force)}${intOrString(this.system)}${this.year}${sequence}`
      const modulus = Number(BigInt(number) % BigInt(23))
      return "ZABCDEFGHJKLMNPQRTUVWXY"[modulus]
    } catch (e) {
      return undefined
    }
  }

  toString() {
    return `${this.year}${this.force}${this.unit}${this.system}${this.sequence
      .toString()
      .padStart(11, "0")}${this.checkCharacter()}`
  }
}

export default Asn
