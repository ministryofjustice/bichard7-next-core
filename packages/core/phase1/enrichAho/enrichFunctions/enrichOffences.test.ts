import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"

import { COMMON_LAWS, INDICTMENT } from "../../../lib/offenceTypes"
import enrichOffences from "../../enrichAho/enrichFunctions/enrichOffences"
import generateMockAho from "../../tests/helpers/generateMockAho"

const mockNationalIndictmmentOffence = [
  {
    ActualOffenceDateCode: "1",
    ActualOffenceEndDate: {},
    ActualOffenceStartDate: {
      StartDate: "2010-11-28T00:00:00.000Z"
    },
    ActualOffenceWording: "Theft of pedal cycle.",
    CommittedOnBail: "D",
    CourtOffenceSequenceNumber: 1,
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "IndictmentOffenceCode",
          FullCode: "TH68046C",
          Indictment: "XX00",
          Qualifier: "C",
          Reason: "68046"
        }
      }
    },
    LocationOfOffence: "Kingston High Street",
    Result: [
      {
        CJSresultCode: 1015,
        ModeOfTrialReason: "SUM",
        PleaStatus: "NG",
        ResultHearingDate: "2011-09-26T00:00:00.000Z",
        ResultHearingType: "OTHER",
        ResultQualifierVariable: [],
        ResultVariableText: "RESULT_TEXT",
        SourceOrganisation: {
          BottomLevelCode: "01",
          OrganisationUnitCode: "B01EF01",
          SecondLevelCode: "01",
          ThirdLevelCode: "EF",
          TopLevelCode: "B"
        },
        Verdict: "G"
      }
    ]
  }
]

const mockNationalCommonLawOffence = [
  {
    ActualOffenceDateCode: "1",
    ActualOffenceEndDate: {},
    ActualOffenceStartDate: {
      StartDate: "2010-11-28T00:00:00.000Z"
    },
    ActualOffenceWording: "Theft of pedal cycle.",
    CommittedOnBail: "D",
    CourtOffenceSequenceNumber: 1,
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "CommonLawOffenceCode",
          CommonLawOffence: "COML",
          FullCode: "COML001C",
          Qualifier: "C",
          Reason: "001"
        }
      }
    },
    LocationOfOffence: "Kingston High Street",
    Result: [
      {
        CJSresultCode: 1015,
        ModeOfTrialReason: "SUM",
        PleaStatus: "NG",
        ResultHearingDate: "2011-09-26T00:00:00.000Z",
        ResultHearingType: "OTHER",
        ResultQualifierVariable: [],
        ResultVariableText: "RESULT_TEXT",
        SourceOrganisation: {
          BottomLevelCode: "01",
          OrganisationUnitCode: "B01EF01",
          SecondLevelCode: "01",
          ThirdLevelCode: "EF",
          TopLevelCode: "B"
        },
        Verdict: "G"
      }
    ]
  }
]

const mockLocalOffence = [
  {
    ActualOffenceDateCode: "1",
    ActualOffenceEndDate: {},
    ActualOffenceStartDate: {
      StartDate: "2010-11-28T00:00:00.000Z"
    },
    ActualOffenceWording: "Theft of pedal cycle.",
    CommittedOnBail: "D",
    CourtOffenceSequenceNumber: 1,
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "LocalOffenceReason",
        LocalOffenceCode: {
          AreaCode: "01",
          OffenceCode: "01CP003"
        }
      }
    },
    LocationOfOffence: "Kingston High Street",
    Result: [
      {
        CJSresultCode: 1015,
        ModeOfTrialReason: "SUM",
        PleaStatus: "NG",
        ResultHearingDate: "2011-09-26T00:00:00.000Z",
        ResultHearingType: "OTHER",
        ResultQualifierVariable: [],
        ResultVariableText: "RESULT_TEXT",
        SourceOrganisation: {
          BottomLevelCode: "01",
          OrganisationUnitCode: "B01EF01",
          SecondLevelCode: "01",
          ThirdLevelCode: "EF",
          TopLevelCode: "B"
        },
        Verdict: "G"
      }
    ]
  }
]

describe("enrichOffences", () => {
  let aho: AnnotatedHearingOutcome

  beforeEach(() => {
    aho = generateMockAho()
  })

  it("SHOULD enrich the offences based on their ASN", () => {
    const result = enrichOffences(aho)
    const offences = result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
    expect(offences).toHaveLength(2)
    offences.forEach((offence) => {
      const cpRef = offence.CriminalProsecutionReference
      expect(cpRef).toStrictEqual({
        DefendantOrOffender: {
          CheckDigit: "K",
          DefendantOrOffenderSequenceNumber: "00000448754",
          OrganisationUnitIdentifierCode: {
            BottomLevelCode: "01",
            OrganisationUnitCode: "01ZD01",
            SecondLevelCode: "01",
            ThirdLevelCode: "ZD"
          },
          Year: "11"
        },
        OffenceReason: {
          __type: "NationalOffenceReason",
          OffenceCode: {
            __type: "NonMatchingOffenceCode",
            ActOrSource: "TH",
            FullCode: "TH68046C",
            Qualifier: "C",
            Reason: "046",
            Year: "68"
          }
        }
      })
    })
  })

  it("SHOULD get the national offence code for NonMatchingOffenceCode", () => {
    const result = enrichOffences(aho)
    const offences = result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
    expect(offences).toHaveLength(2)
    offences.forEach((offence) => {
      const cpRef = offence.CriminalProsecutionReference
      expect(cpRef).toHaveProperty("OffenceReason")
      expect(cpRef.OffenceReason).toHaveProperty("OffenceCode")
      expect(cpRef.OffenceReason).toStrictEqual({
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: "TH",
          FullCode: "TH68046C",
          Qualifier: "C",
          Reason: "046",
          Year: "68"
        }
      })
    })
  })

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("SHOULD get National Offence Code for Indictment", () => {
    // we are skipping Indictment as there are no Indictment code in `offence-code.json`
    // @ts-ignore - ts doesn't like how type is assigned it treats it as a string and not the value
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = mockNationalIndictmmentOffence
    const result = enrichOffences(aho)
    const offences = result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
    expect(offences).toHaveLength(1)
    offences.forEach((offence) => {
      const cpRef = offence.CriminalProsecutionReference
      expect(cpRef).toHaveProperty("OffenceReason")
      expect(cpRef.OffenceReason).toHaveProperty("OffenceCode")
      expect(cpRef.OffenceReason).toStrictEqual({
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "IndictmentOffenceCode",
          FullCode: "TH68046C",
          Indictment: INDICTMENT,
          Qualifier: "C",
          Reason: "68046"
        }
      })
    })
  })

  it("SHOULD get National Offence Code for CommonLawOffence", () => {
    // @ts-ignore - ts doesn't like how type is assigned it treats it as a string and not the value
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = mockNationalCommonLawOffence
    const result = enrichOffences(aho)
    const offences = result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
    expect(offences).toHaveLength(1)
    offences.forEach((offence) => {
      const cpRef = offence.CriminalProsecutionReference
      expect(cpRef).toHaveProperty("OffenceReason")
      expect(cpRef.OffenceReason).toHaveProperty("OffenceCode")
      expect(cpRef.OffenceReason).toStrictEqual({
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "CommonLawOffenceCode",
          CommonLawOffence: COMMON_LAWS,
          FullCode: "COML001C",
          Qualifier: "C",
          Reason: "001"
        }
      })
    })
  })

  it("SHOULD get Local Offence Code", () => {
    // @ts-ignore - ts doesn't like how type is assigned it treats it as a string and not the value
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = mockLocalOffence
    const result = enrichOffences(aho)
    const offences = result.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence
    expect(offences).toHaveLength(1)
    offences.forEach((offence) => {
      const cpRef = offence.CriminalProsecutionReference
      expect(cpRef).toHaveProperty("OffenceReason")
      expect(cpRef.OffenceReason).toHaveProperty("LocalOffenceCode")
      expect(cpRef.OffenceReason).toStrictEqual({
        __type: "LocalOffenceReason",
        LocalOffenceCode: {
          AreaCode: "01",
          OffenceCode: "01CP003"
        }
      })
    })
  })
})
