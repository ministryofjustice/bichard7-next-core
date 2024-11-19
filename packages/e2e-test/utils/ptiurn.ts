class PTIURN {
  forcePNC: string
  unitPNC: string
  sequenceNumber: number

  constructor(ptiurn: string) {
    this.forcePNC = ptiurn.slice(0, 2)
    this.unitPNC = ptiurn.slice(2, 4)
    this.sequenceNumber = parseInt(ptiurn.slice(4), 10)
  }

  randomiseSequence() {
    this.sequenceNumber = Math.random() * 8999999 + 1000000
  }

  toString() {
    return `${this.forcePNC}${this.unitPNC}${this.sequenceNumber.toString().padStart(7, "0")}`
  }
}

export default PTIURN
