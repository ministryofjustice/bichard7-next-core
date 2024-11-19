import generateFakeAho from "../../phase1/tests/helpers/generateFakeAho"
import generator from "./HO200110"

const generateAho = (options: { isDummyAsn: boolean; isRecordable: boolean }) =>
  generateFakeAho({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            ArrestSummonsNumber: options.isDummyAsn ? "0800PP0111111111111A" : "1101ZD0100000410780J"
          },
          RecordableOnPNCindicator: options.isRecordable
        }
      }
    }
  })

describe("HO200110", () => {
  it("should generate exception when case is recordable and ASN is dummy", () => {
    const aho = generateAho({ isDummyAsn: true, isRecordable: true })

    const exceptions = generator(aho)

    expect(exceptions).toEqual([
      {
        code: "HO200110",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it.each([
    { isDummyAsn: true, isRecordable: false, when: "ASN is dummy but case is not recordable" },
    { isDummyAsn: false, isRecordable: true, when: "case is recordable but ASN is not dummy" },
    { isDummyAsn: false, isRecordable: false, when: "case is not recordable and ASN is not dummy" }
  ])("should not generate exception when $when", ({ isDummyAsn, isRecordable }) => {
    const aho = generateAho({ isDummyAsn, isRecordable })

    const exceptions = generator(aho)

    expect(exceptions).toHaveLength(0)
  })
})
