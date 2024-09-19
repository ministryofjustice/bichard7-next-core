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

  it.each([
    { when: "ASN is dummy but case is not recordable", isRecordable: false, isDummyAsn: true },
    { when: "case is recordable but ASN is not dummy", isRecordable: true, isDummyAsn: false },
    { when: "case is not recordable and ASN is not dummy", isRecordable: false, isDummyAsn: true }
  ])("should not generate exception when $when", ({ isRecordable, isDummyAsn }) => {
    const aho = generateAho({ isRecordable, isDummyAsn })

    const exceptions = generator(aho)

    expect(exceptions).toHaveLength(0)
  })
})
