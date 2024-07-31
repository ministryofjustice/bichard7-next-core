import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import { CjsVerdict } from "../../types/Verdict"
import TRPR0020 from "./TRPR0020"

const triggerCode = TriggerCode.TRPR0020
const resultCodes = [1029, 1030, 1031, 1032, 3501]
const excludedResultCodes = [1000, 1040]
// prettier-ignore
const offenceCodes = [
  "CD98001", "CD98019", "CD98020", "CD98021", "CD98058", "CJ03506", "CJ03507", "CJ03510", "CJ03511",
  "CJ03522", "CJ03523", "CJ08507", "CJ08512", "CJ08519", "CJ08521", "CJ08526", "CJ91001", "CJ91002",
  "CJ91028", "CJ91029", "CJ91031", "CJ91039", "CS97001", "FB89004", "LP80001", "MC80002", "MC80508",
  "MC80601", "PC00003", "PC00004", "PC00005", "PC00006", "PC00007", "PC00008", "PC00009", "PC00010",
  "PC00501", "PC00502", "PC00504", "PC00505", "PC00515", "PC00525", "PC00535", "PC00545", "PC00555",
  "PC00565", "PC00575", "PC00585", "PC00595", "PC00605", "PC00615", "PC00625", "PC00635", "PC00645",
  "PC00655", "PC00665", "PC00700", "PC00702", "PC73003", "PU86051", "PU86089", "PU86118", "SC07001",
  "SE20501", "SE20502", "SE20511", "SE20512", "SE20516", "SE20517", "SE20518", "SE20521", "SE20525",
  "SE20532", "SE20537", "SE20538", "SE20540", "SE20542", "SE20546", "SE20547", "SE20552", "SO59501",
  "ST19001", "SX03202", "SX03220", "SX03221", "SX03222", "SX03223"
]

const generateMockAho = (resultCode: number, offenceCode: string, verdict: CjsVerdict) => {
  return generateAhoFromOffenceList([
    {
      Result: [
        {
          CJSresultCode: resultCode,
          Verdict: verdict
        }
      ],
      CriminalProsecutionReference: {
        OffenceReason: { OffenceCode: { FullCode: offenceCode } }
      },
      CourtOffenceSequenceNumber: 1
    }
  ] as Offence[])
}

const offenceSequenceNumber = (generatedHearingOutcome: AnnotatedHearingOutcome) => {
  return generatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0]
    .CourtOffenceSequenceNumber
}

describe("TRPR0020", () => {
  resultCodes.forEach((resultCode) => {
    offenceCodes.forEach((offenceCode) => {
      it(`should raise a trigger if result code equals ${resultCode} (result code is final), is guilty and offence code matches ${offenceCode}`, () => {
        const generatedHearingOutcome = generateMockAho(resultCode, offenceCode, CjsVerdict.Guilty)

        const result = TRPR0020(generatedHearingOutcome)

        expect(result).toEqual([
          { code: triggerCode, offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome) }
        ])
      })

      it(`should raise a trigger if result code equals ${resultCode} (result code is final), is not guilty and offence code matches ${offenceCode}`, () => {
        const generatedHearingOutcome = generateMockAho(resultCode, offenceCode, CjsVerdict.NotGuilty)

        const result = TRPR0020(generatedHearingOutcome)

        expect(result).toEqual([
          { code: triggerCode, offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome) }
        ])
      })
    })
  })

  offenceCodes.forEach((offenceCode) => {
    it(`should not raise a trigger if result code equals 1085 (result code is not final and not excluded), is guilty and offence code matches ${offenceCode}`, () => {
      const generatedHearingOutcome = generateMockAho(1085, offenceCode, CjsVerdict.Guilty)

      const result = TRPR0020(generatedHearingOutcome)

      expect(result).toHaveLength(0)
    })

    it(`should not raise a trigger if result code equals 1085 (result code is not final and not excluded), is not guilty and offence code matches ${offenceCode}`, () => {
      const generatedHearingOutcome = generateMockAho(1085, offenceCode, CjsVerdict.NotGuilty)

      const result = TRPR0020(generatedHearingOutcome)

      expect(result).toHaveLength(0)
    })
  })

  excludedResultCodes.forEach((resultCode) => {
    offenceCodes.forEach((offenceCode) => {
      it(`should not raise a trigger if result code equals ${resultCode} (result code is excluded), is guilty and offence code matches ${offenceCode}`, () => {
        const generatedHearingOutcome = generateMockAho(resultCode, offenceCode, CjsVerdict.Guilty)

        const result = TRPR0020(generatedHearingOutcome)

        expect(result).toHaveLength(0)
      })

      it(`should not raise a trigger if result code equals ${resultCode} (result code is excluded), is not guilty and offence code matches ${offenceCode}`, () => {
        const generatedHearingOutcome = generateMockAho(resultCode, offenceCode, CjsVerdict.NotGuilty)

        const result = TRPR0020(generatedHearingOutcome)

        expect(result).toHaveLength(0)
      })
    })
    it(`should not raise a trigger if result code equals ${resultCode} (result code is excluded), is guilty and offence code is not from the list`, () => {
      const generatedHearingOutcome = generateMockAho(resultCode, "XXXXXXX", CjsVerdict.Guilty)

      const result = TRPR0020(generatedHearingOutcome)

      expect(result).toHaveLength(0)
    })

    it(`should not raise a trigger if result code equals ${resultCode} (result code is excluded), is not guilty and offence code offence code is not from the list`, () => {
      const generatedHearingOutcome = generateMockAho(resultCode, "XXXXXXX", CjsVerdict.NotGuilty)

      const result = TRPR0020(generatedHearingOutcome)

      expect(result).toHaveLength(0)
    })
  })

  resultCodes.forEach((resultCode) => {
    it(`should raise a trigger if result code equals ${resultCode} (result code is final), is guilty and offence code is not from the list`, () => {
      const generatedHearingOutcome = generateMockAho(resultCode, "XXXXXXX", CjsVerdict.Guilty)

      const result = TRPR0020(generatedHearingOutcome)

      expect(result).toEqual([
        { code: triggerCode, offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome) }
      ])
    })

    it(`should raise a trigger if result code equals ${resultCode} (result code is final), is not guilty and offence code offence code is not from the list`, () => {
      const generatedHearingOutcome = generateMockAho(resultCode, "XXXXXXX", CjsVerdict.NotGuilty)

      const result = TRPR0020(generatedHearingOutcome)

      expect(result).toEqual([
        { code: triggerCode, offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome) }
      ])
    })
  })

  it("should not raise a trigger if result code equals 1085 (result code is not final and not excluded), is guilty and offence code is not from the list", () => {
    const generatedHearingOutcome = generateMockAho(1085, "XXXXXXX", CjsVerdict.Guilty)

    const result = TRPR0020(generatedHearingOutcome)

    expect(result).toHaveLength(0)
  })

  it("should not raise a trigger if result code equals 1085 (result code is not final and not excluded), is not guilty and offence code is not from the list", () => {
    const generatedHearingOutcome = generateMockAho(1085, "XXXXXXX", CjsVerdict.NotGuilty)

    const result = TRPR0020(generatedHearingOutcome)

    expect(result).toHaveLength(0)
  })
})
