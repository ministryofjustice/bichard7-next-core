import generateMockAho from "phase1/tests/helpers/generateMockAho"
import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import { COMMON_LAWS, INDICTMENT } from "../../lib/offenceTypes"
import enrichOffences from "./enrichOffences"

const mockNationalIndictmmentOffence = [
  {
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "IndictmentOffenceCode",
          Reason: "68046",
          Qualifier: "C",
          FullCode: "TH68046C",
          Indictment: "XX00"
        }
      }
    },
    ActualOffenceDateCode: "1",
    ActualOffenceStartDate: {
      StartDate: "2010-11-28T00:00:00.000Z"
    },
    ActualOffenceEndDate: {},
    LocationOfOffence: "Kingston High Street",
    ActualOffenceWording: "Theft of pedal cycle.",
    CommittedOnBail: "D",
    CourtOffenceSequenceNumber: 1,
    Result: [
      {
        CJSresultCode: 1015,
        SourceOrganisation: {
          TopLevelCode: "B",
          SecondLevelCode: "01",
          ThirdLevelCode: "EF",
          BottomLevelCode: "01",
          OrganisationUnitCode: "B01EF01"
        },
        ResultHearingType: "OTHER",
        ResultHearingDate: "2011-09-26T00:00:00.000Z",
        PleaStatus: "NG",
        Verdict: "G",
        ModeOfTrialReason: "SUM",
        ResultVariableText: "RESULT_TEXT",
        ResultQualifierVariable: []
      }
    ]
  }
]

const mockNationalCommonLawOffence = [
  {
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "CommonLawOffenceCode",
          Reason: "001",
          Qualifier: "C",
          FullCode: "COML001C",
          CommonLawOffence: "COML"
        }
      }
    },
    ActualOffenceDateCode: "1",
    ActualOffenceStartDate: {
      StartDate: "2010-11-28T00:00:00.000Z"
    },
    ActualOffenceEndDate: {},
    LocationOfOffence: "Kingston High Street",
    ActualOffenceWording: "Theft of pedal cycle.",
    CommittedOnBail: "D",
    CourtOffenceSequenceNumber: 1,
    Result: [
      {
        CJSresultCode: 1015,
        SourceOrganisation: {
          TopLevelCode: "B",
          SecondLevelCode: "01",
          ThirdLevelCode: "EF",
          BottomLevelCode: "01",
          OrganisationUnitCode: "B01EF01"
        },
        ResultHearingType: "OTHER",
        ResultHearingDate: "2011-09-26T00:00:00.000Z",
        PleaStatus: "NG",
        Verdict: "G",
        ModeOfTrialReason: "SUM",
        ResultVariableText: "RESULT_TEXT",
        ResultQualifierVariable: []
      }
    ]
  }
]

const mockLocalOffence = [
  {
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "LocalOffenceReason",
        LocalOffenceCode: {
          AreaCode: "01",
          OffenceCode: "01CP003"
        }
      }
    },
    ActualOffenceDateCode: "1",
    ActualOffenceStartDate: {
      StartDate: "2010-11-28T00:00:00.000Z"
    },
    ActualOffenceEndDate: {},
    LocationOfOffence: "Kingston High Street",
    ActualOffenceWording: "Theft of pedal cycle.",
    CommittedOnBail: "D",
    CourtOffenceSequenceNumber: 1,
    Result: [
      {
        CJSresultCode: 1015,
        SourceOrganisation: {
          TopLevelCode: "B",
          SecondLevelCode: "01",
          ThirdLevelCode: "EF",
          BottomLevelCode: "01",
          OrganisationUnitCode: "B01EF01"
        },
        ResultHearingType: "OTHER",
        ResultHearingDate: "2011-09-26T00:00:00.000Z",
        PleaStatus: "NG",
        Verdict: "G",
        ModeOfTrialReason: "SUM",
        ResultVariableText: "RESULT_TEXT",
        ResultQualifierVariable: []
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
          Year: "11",
          OrganisationUnitIdentifierCode: {
            SecondLevelCode: "01",
            ThirdLevelCode: "ZD",
            BottomLevelCode: "01",
            OrganisationUnitCode: "01ZD01"
          },
          DefendantOrOffenderSequenceNumber: "00000448754",
          CheckDigit: "K"
        },
        OffenceReason: {
          OffenceCode: {
            ActOrSource: "TH",
            FullCode: "TH68046C",
            Qualifier: "C",
            Reason: "046",
            Year: "68",
            __type: "NonMatchingOffenceCode"
          },
          __type: "NationalOffenceReason"
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
        OffenceCode: {
          ActOrSource: "TH",
          FullCode: "TH68046C",
          Qualifier: "C",
          Reason: "046",
          Year: "68",
          __type: "NonMatchingOffenceCode"
        },
        __type: "NationalOffenceReason"
      })
    })
  })

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
        OffenceCode: {
          Indictment: INDICTMENT,
          FullCode: "TH68046C",
          Qualifier: "C",
          Reason: "68046",
          __type: "IndictmentOffenceCode"
        },
        __type: "NationalOffenceReason"
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
        OffenceCode: {
          CommonLawOffence: COMMON_LAWS,
          FullCode: "COML001C",
          Qualifier: "C",
          Reason: "001",
          __type: "CommonLawOffenceCode"
        },
        __type: "NationalOffenceReason"
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
        LocalOffenceCode: {
          AreaCode: "01",
          OffenceCode: "01CP003"
        },
        __type: "LocalOffenceReason"
      })
    })
  })
})
