import generateFakeAho from "../../phase1/tests/helpers/generateFakeAho"
import generator from "./HO200110"

const generateAho = (options: { isRecordable: boolean; isDummyAsn: boolean }) =>
  generateFakeAho({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          RecordableOnPNCindicator: options.isRecordable,
          HearingDefendant: {
            ArrestSummonsNumber: options.isDummyAsn ? "0800PP0111111111111A" : "1101ZD0100000410780J"
          }
        }
      }
    }
  })

describe("HO200110", () => {
  it("should generate exception when case is recordable and ASN is dummy", () => {
    const aho = generateAho({ isRecordable: true, isDummyAsn: true })

    const exceptions = generator(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200110",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("should not generate exception when ASN is dummy but case is not recordable", () => {
    const aho = generateAho({ isRecordable: false, isDummyAsn: true })

    const exceptions = generator(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("should not generate exception when case is recordable but ASN is not dummy", () => {
    const aho = generateAho({ isRecordable: true, isDummyAsn: false })

    const exceptions = generator(aho)

    expect(exceptions).toHaveLength(0)
  })

  it("should not generate exception when case is not recordable and ASN is not dummy", () => {
    const aho = generateAho({ isRecordable: false, isDummyAsn: false })

    const exceptions = generator(aho)

    expect(exceptions).toHaveLength(0)
  })
})
