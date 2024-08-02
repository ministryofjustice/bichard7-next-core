import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import TRPR0029 from "./TRPR0029"

const generateMockAho = (
  resultVariableText: string,
  RecordableOnPNCindicator: string | undefined,
  offenceCode: string,
  hasPncQuery: boolean,
  hasSecondResult = false
) =>
  ({
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: {
            Offence: [
              {
                Result: [
                  {
                    ResultVariableText: resultVariableText
                  },
                  hasSecondResult
                    ? {
                        ResultVariableText: "Fined 100."
                      }
                    : {}
                ],
                RecordableOnPNCindicator: RecordableOnPNCindicator,
                CriminalProsecutionReference: {
                  OffenceReason: { OffenceCode: { FullCode: offenceCode } }
                }
              }
            ]
          }
        }
      }
    },
    ...(hasPncQuery ? { PncQuery: { PncId: "foo" } } : {})
  }) as unknown as AnnotatedHearingOutcome

const triggerCode = TriggerCode.TRPR0029
// prettier-ignore
const offenceCodes = [
  "AS14504", "AS14509", "AS14511", "CD98501", "CD98502", "CD98503", "CD98517", "CD98519", "CD98525",
  "CJ08503", "CJ08504", "CJ08505", "CS10501", "CS10502", "FB89501", "FB89506", "MC80530", "MS15501",
  "MS15502", "MS15503", "MS15504", "PC00503", "PC00506", "PC09504", "PC09505", "PC09510", "PH97503",
  "SE20503", "SE20505", "SE20506", "SE20513", "SE20529", "SE20541", "SE20545", "ST19501"
]
// prettier-ignore
const offenceCodesForGrantedResultText = [
  "AS14501", "AS14502", "AS14503", "AS14505", "AS14506", "AS14507", "AS14508", "AS14510", "AS14512",
  "AS14513", "AW06502", "CC81501", "CD98510", "CD98516", "CD98518", "CD98527", "CD98528", "CJ03509",
  "CJ03513", "CJ03519", "CJ03520", "CJ08506", "CJ08508", "CJ08522", "FB89502", "FB89503", "MC80515",
  "PC09501", "PC09502", "PC09503", "PC09506", "PC09507", "PC09508", "PC09509", "PC09511", "PH97501",
  "PH97502", "PL84503", "RO88504", "RO88505", "ST19502", "ST19503", "ST19504", "ST19505", "ST19506",
  "ST19507", "SX03505", "SX03506", "SX03507", "SX03508", "SX03509", "SX03510", "SX03511", "SX03512",
  "SX03513", "SX03514", "SX03515", "SX03516", "SX03517", "SX03518", "SX03519", "SX03520", "SX03521",
  "SX03522", "SX03523", "SX03524", "SX03525", "SX03526", "SX03527", "SX03528", "SX03529", "SX03530",
  "SX03531", "SX03532", "SX03540", "SX03541", "SX03542", "SX03543", "SX03544", "SX03545", "SX03546",
  "SX03547", "SX03548", "SX03549", "TR08500", "TR08501", "TR08502", "TR08503", "VC06501", "VC06502",
  "VC06503", "VC06504", "VC06505", "YJ99501", "YJ99503"
]

describe("TRPR0029", () => {
  it.each(offenceCodes)(
    "Should generate a trigger when case has no pnc query, no recordable offence, and offence code is %s",
    (offenceCode) => {
      const result = TRPR0029(generateMockAho("", undefined, offenceCode, false))
      expect(result).toEqual([{ code: triggerCode }])
    }
  )

  it.each(offenceCodes)(
    "Should not generate a trigger when case has no pnc query but has a recordable offence, and offence code is %s",
    (offenceCode) => {
      const result = TRPR0029(generateMockAho("", "true", offenceCode, false))
      expect(result).toHaveLength(0)
    }
  )

  it.each(offenceCodes)(
    "Should not generate a trigger when case has a pnc query but has no recordable offence, and offence code is %s",
    (offenceCode) => {
      const result = TRPR0029(generateMockAho("", undefined, offenceCode, true))
      expect(result).toHaveLength(0)
    }
  )

  it.each(offenceCodesForGrantedResultText)(
    "Should generate a trigger when case has no pnc query, no recordable offence, and offence code is %s and result variable text says granted",
    (offenceCode) => {
      const result = TRPR0029(generateMockAho("granted", undefined, offenceCode, false))
      expect(result).toEqual([{ code: triggerCode }])
    }
  )

  it.each(offenceCodesForGrantedResultText)(
    "Should not generate a trigger when case has no pnc query, no recordable offence, and offence code is %s and result variable text does not say granted",
    (offenceCode) => {
      const result = TRPR0029(generateMockAho("Fined 100.", undefined, offenceCode, false))
      expect(result).toHaveLength(0)
    }
  )

  it.each(offenceCodesForGrantedResultText)(
    "Should not generate a trigger when case has no pnc query but has a recordable offence, and offence code is %s and result variable text says granted",
    (offenceCode) => {
      const result = TRPR0029(generateMockAho("granted", "true", offenceCode, false))
      expect(result).toHaveLength(0)
    }
  )

  it.each(offenceCodesForGrantedResultText)(
    "Should not generate a trigger when case has a pnc query but has no recordable offence, and offence code is %s and result variable text says granted",
    (offenceCode) => {
      const result = TRPR0029(generateMockAho("granted", undefined, offenceCode, true))
      expect(result).toHaveLength(0)
    }
  )

  it("Should not generate a trigger when case has no pnc query, no recordable offence, and offence code is not from the lists", () => {
    const result = TRPR0029(generateMockAho("", undefined, "XXXXXXX", false))
    expect(result).toHaveLength(0)
  })

  it.each(offenceCodesForGrantedResultText)(
    "Should not generate a trigger when case has no pnc query, no recordable offence, offence code is %s and one result contains 'granted' while another does not",
    (offenceCode) => {
      const result = TRPR0029(generateMockAho("granted", undefined, offenceCode, true, true))
      expect(result).toHaveLength(0)
    }
  )
})
