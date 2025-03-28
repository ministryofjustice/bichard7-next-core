import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"

import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import { CjsVerdict } from "../../types/Verdict"
import TRPR0004 from "./TRPR0004"

describe("TRPR0004", () => {
  const triggerCode = TriggerCode.TRPR0004
  const resultCodes = [3052, 3081, 3085, 3086, 3087, 3088, 3089, 3090, 3091, 1179, 1181, 3281, 3282]

  // prettier-ignore
  const offenceCodes = [
  "SX56001", "SX56005", "SX56006", "SX56010", "SX56013", "SX56014", "SX56015", "SX56021", "SX56022",
  "SX56023", "SX56024", "SX56025", "SX56026", "SX56027", "SX56028", "SX56029", "SX56030", "SX56031",
  "SX56047", "SX56048", "SX56049", "SX56050", "IC60005", "IC60006", "IC60007", "IC60008", "CL77015",
  "PK78001", "PK78002", "PK78003", "PK78004", "PK78005", "PK78006", "PK78007", "PK78008", "CJ88115",
  "CJ09001", "SA00001", "SA00002", "SX03001", "SX03002", "SX03003", "SX03004", "SX03005", "SX03006",
  "SX03007", "SX03008", "SX03009", "SX03010", "SX03011", "SX03012", "SX03013", "SX03014", "SX03015",
  "SX03016", "SX03017", "SX03018", "SX03019", "SX03020", "SX03021", "SX03022", "SX03023", "SX03024",
  "SX03025", "SX03026", "SX03027", "SX03028", "SX03029", "SX03030", "SX03031", "SX03032", "SX03033",
  "SX03034", "SX03035", "SX03036", "SX03037", "SX03038", "SX03039", "SX03040", "SX03041", "SX03042",
  "SX03043", "SX03044", "SX03045", "SX03046", "SX03047", "SX03048", "SX03049", "SX03050", "SX03051",
  "SX03052", "SX03053", "SX03054", "SX03055", "SX03056", "SX03057", "SX03058", "SX03059", "SX03060",
  "SX03061", "SX03062", "SX03063", "SX03064", "SX03065", "SX03066", "SX03067", "SX03068", "SX03069",
  "SX03070", "SX03071", "SX03072", "SX03073", "SX03074", "SX03075", "SX03076", "SX03077", "SX03078",
  "SX03079", "SX03080", "SX03081", "SX03082", "SX03083", "SX03084", "SX03085", "SX03086", "SX03087",
  "SX03088", "SX03089", "SX03090", "SX03091", "SX03092", "SX03093", "SX03094", "SX03095", "SX03096",
  "SX03097", "SX03098", "SX03099", "SX03100", "SX03101", "SX03102", "SX03103", "SX03104", "SX03105",
  "SX03106", "SX03107", "SX03108", "SX03109", "SX03110", "SX03111", "SX03123", "SX03124", "SX03125",
  "SX03126", "SX03127", "SX03128", "SX03129", "SX03130", "SX03131", "SX03132", "SX03133", "SX03134",
  "SX03135", "SX03136", "SX03137", "SX03156", "SX03157", "SX03158", "SX03159", "SX03160", "SX03161",
  "SX03162", "SX03163", "SX03164", "SX03165", "SX03166", "SX03167", "SX03168", "SX03169", "SX03170",
  "SX03171", "SX03172", "SX03173", "SX03174", "SX03175", "SX03176", "SX03177", "SX03178", "SX03179",
  "SX03181", "SX03182", "SX03183", "SX03184", "SX03185", "SX03186", "SX03187", "SX03188", "SX03189",
  "SX03190", "SX03191", "SX03192", "SX03193", "SX03194", "SX03195", "SX03196", "SX03197", "SX03198",
  "SX03199", "SX03200", "SX03201", "SX03208", "SX03209", "SX03224", "SX03225", "SX03226", "SX03227",
  "SX03228", "SX03229", "SX03230", "SX03231", "SX03232", "SX03233", "SX03234", "CE79180", "CE79161",
  "CD98001", "CD98055", "CD98056"
]

  const generateMockAho = (
    resultCode: number,
    offenceCode: string,
    resultVariableText: string,
    verdict: CjsVerdict
  ) => {
    return generateAhoFromOffenceList([
      {
        Result: [
          {
            CJSresultCode: resultCode,
            ResultVariableText: resultVariableText,
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

  resultCodes.forEach((resultCode) => {
    offenceCodes.forEach((offenceCode) => {
      it(`should raise a trigger if result code equals ${resultCode}, is guilty and offence code matches ${offenceCode}, and offence result text is a sexual offence`, () => {
        const generatedHearingOutcome = generateMockAho(resultCode, offenceCode, "Sexual offender", CjsVerdict.Guilty)

        const result = TRPR0004(generatedHearingOutcome)

        expect(result).toEqual([
          {
            code: triggerCode,
            offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
          }
        ])
      })

      it(`should raise a trigger if result code equals ${resultCode}, is not guilty and offence code matches ${offenceCode}, and offence result text is a sexual offence`, () => {
        const generatedHearingOutcome = generateMockAho(
          resultCode,
          offenceCode,
          "Sexual offender",
          CjsVerdict.NotGuilty
        )

        const result = TRPR0004(generatedHearingOutcome)

        expect(result).toEqual([
          {
            code: triggerCode,
            offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
          }
        ])
      })

      it(`should raise a trigger if result code equals ${resultCode}, is guilty and offence code matches ${offenceCode}, and offence result text is a not sexual offence`, () => {
        const generatedHearingOutcome = generateMockAho(resultCode, offenceCode, "Robbery", CjsVerdict.NotGuilty)

        const result = TRPR0004(generatedHearingOutcome)

        expect(result).toEqual([
          {
            code: triggerCode,
            offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
          }
        ])
      })

      it(`should raise a trigger if result code equals ${resultCode}, is guilty and offence code matches ${offenceCode}, and offence result text is a not sexual offence`, () => {
        const generatedHearingOutcome = generateMockAho(resultCode, offenceCode, "Robbery", CjsVerdict.Guilty)

        const result = TRPR0004(generatedHearingOutcome)

        expect(result).toEqual([
          {
            code: triggerCode,
            offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
          }
        ])
      })
    })
  })

  it.each(offenceCodes)(
    "should raise a trigger if result code doesn't match code from the list, is guilty and offence code matches %s, and offence result text is a sexual offence",
    (offenceCode) => {
      const generatedHearingOutcome = generateMockAho(9999, offenceCode, "Sexual offender", CjsVerdict.Guilty)

      const result = TRPR0004(generatedHearingOutcome)

      expect(result).toEqual([
        {
          code: triggerCode,
          offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
        }
      ])
    }
  )

  it.each(offenceCodes)(
    "should raise a trigger if result code doesn't match code from the list, is guilty and offence code matches %s, and offence result text is not a sexual offence",
    (offenceCode) => {
      const generatedHearingOutcome = generateMockAho(9999, offenceCode, "Robbery", CjsVerdict.Guilty)

      const result = TRPR0004(generatedHearingOutcome)

      expect(result).toEqual([
        {
          code: triggerCode,
          offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
        }
      ])
    }
  )

  it.each(offenceCodes)(
    "should raise a trigger if result code doesn't match code from the list, is not guilty and offence code matches %s, and offence result text is a sexual offence",
    (offenceCode) => {
      const generatedHearingOutcome = generateMockAho(9999, offenceCode, "Sexual offender", CjsVerdict.NotGuilty)

      const result = TRPR0004(generatedHearingOutcome)

      expect(result).toEqual([
        {
          code: triggerCode,
          offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
        }
      ])
    }
  )

  it.each(offenceCodes)(
    "should raise a trigger if result code doesn't match code from the list, is not guilty and offence code matches %s, and offence result text is not a sexual offence",
    (offenceCode) => {
      const generatedHearingOutcome = generateMockAho(9999, offenceCode, "Robbery", CjsVerdict.NotGuilty)

      const result = TRPR0004(generatedHearingOutcome)
      expect(result).toHaveLength(0)
    }
  )

  it.each(resultCodes)(
    "should raise a trigger if result code is %i, is guilty and offence code doesn't match code from the list, and offence result text is a sexual offence",
    (resultCode) => {
      const generatedHearingOutcome = generateMockAho(resultCode, "XY98056", "Sexual offender", CjsVerdict.Guilty)

      const result = TRPR0004(generatedHearingOutcome)

      expect(result).toEqual([
        {
          code: triggerCode,
          offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
        }
      ])
    }
  )

  it.each(resultCodes)(
    "should raise a trigger if result code is %i, is guilty and offence code doesn't match code from the list, and offence result text is not a sexual offence",
    (resultCode) => {
      const generatedHearingOutcome = generateMockAho(resultCode, "XY98056", "Robbery", CjsVerdict.Guilty)

      const result = TRPR0004(generatedHearingOutcome)

      expect(result).toEqual([
        {
          code: triggerCode,
          offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
        }
      ])
    }
  )

  it.each(resultCodes)(
    "should raise a trigger if result code is %i, is not guilty and offence code doesn't match code from the list, and offence result text is a sexual offence",
    (resultCode) => {
      const generatedHearingOutcome = generateMockAho(resultCode, "XY98056", "Sexual offender", CjsVerdict.NotGuilty)

      const result = TRPR0004(generatedHearingOutcome)

      expect(result).toEqual([
        {
          code: triggerCode,
          offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
        }
      ])
    }
  )

  it.each(resultCodes)(
    "should raise a trigger if result code is %i, is not guilty and offence code doesn't match code from the list, and offence result text is not a sexual offence",
    (resultCode) => {
      const generatedHearingOutcome = generateMockAho(resultCode, "XY98056", "Robbery", CjsVerdict.NotGuilty)

      const result = TRPR0004(generatedHearingOutcome)

      expect(result).toEqual([
        {
          code: triggerCode,
          offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
        }
      ])
    }
  )

  it("should raise a trigger if result code doesn't match code from the list, is guilty and offence code doesn't match code from the list, and offence result text is a sexual offence", () => {
    const generatedHearingOutcome = generateMockAho(9999, "XY98056", "Sexual offender", CjsVerdict.Guilty)

    const result = TRPR0004(generatedHearingOutcome)

    expect(result).toEqual([
      {
        code: triggerCode,
        offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
      }
    ])
  })

  it("should raise a trigger if result code doesn't match code from the list, is guilty and offence code doesn't match code from the list, and offence result text is not a sexual offence", () => {
    const generatedHearingOutcome = generateMockAho(9999, "XY98056", "Robbery", CjsVerdict.Guilty)

    const result = TRPR0004(generatedHearingOutcome)

    expect(result).toHaveLength(0)
  })

  it("should raise a trigger if result code doesn't match code from the list, is not guilty and offence code doesn't match code from the list, and offence result text is a sexual offence", () => {
    const generatedHearingOutcome = generateMockAho(9999, "XY98056", "Sexual offender", CjsVerdict.NotGuilty)

    const result = TRPR0004(generatedHearingOutcome)

    expect(result).toEqual([
      {
        code: triggerCode,
        offenceSequenceNumber: offenceSequenceNumber(generatedHearingOutcome)
      }
    ])
  })

  it("should raise a trigger if result code doesn't match code from the list, is not guilty and offence code doesn't match code from the list, and offence result text is not a sexual offence", () => {
    const generatedHearingOutcome = generateMockAho(9999, "XY98056", "Robbery", CjsVerdict.NotGuilty)

    const result = TRPR0004(generatedHearingOutcome)

    expect(result).toHaveLength(0)
  })
})
