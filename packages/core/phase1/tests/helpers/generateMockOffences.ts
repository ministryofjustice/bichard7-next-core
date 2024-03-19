import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../types/PncQueryResult"
import parsePncDate from "../../lib/parsePncDate"

export type CreateHoOffenceOptions = {
  actOrSource?: string
  year?: string
  reason?: string
  startDate: string
  endDate?: string
  resultCodes?: string[]
  offenceCategory?: string
  sequenceNumber?: number
  courtCaseReferenceNumber?: string
  manualSequenceNumber?: number
  offenceDateCode?: string
}

export const createHOOffence = ({
  actOrSource = "VG",
  year = "24",
  reason = "030",
  startDate,
  endDate,
  resultCodes,
  offenceCategory,
  sequenceNumber,
  courtCaseReferenceNumber,
  manualSequenceNumber,
  offenceDateCode
}: CreateHoOffenceOptions): Offence => {
  const offence: Partial<Offence> = {
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: actOrSource,
          Year: year,
          Reason: reason,
          FullCode: `${actOrSource}${year}${reason}`
        }
      },
      DefendantOrOffender: {
        Year: "",
        OrganisationUnitIdentifierCode: {
          TopLevelCode: "B",
          SecondLevelCode: "01",
          ThirdLevelCode: "EF",
          BottomLevelCode: "00",
          OrganisationUnitCode: "B01EF00"
        },
        DefendantOrOffenderSequenceNumber: "",
        CheckDigit: ""
      },
      OffenceReasonSequence: sequenceNumber?.toString()
    },
    ActualOffenceStartDate: {
      StartDate: new Date(startDate)
    },
    ActualOffenceDateCode: offenceDateCode,
    Result: resultCodes
      ? resultCodes.map(
          (code): Result => ({
            CJSresultCode: parseInt(code, 10),
            SourceOrganisation: {
              SecondLevelCode: "01",
              ThirdLevelCode: "OK",
              BottomLevelCode: "00",
              OrganisationUnitCode: "01OK00"
            },
            ResultQualifierVariable: [{ Code: "A" }]
          })
        )
      : [],
    OffenceCategory: offenceCategory,
    CourtCaseReferenceNumber: courtCaseReferenceNumber
  }

  if (!!endDate) {
    offence.ActualOffenceEndDate = {
      EndDate: new Date(endDate)
    }
  }

  if (!!manualSequenceNumber) {
    offence.ManualSequenceNumber = !!manualSequenceNumber
  }

  return offence as Offence
}

export type CreatePNCCourtCaseOffenceOptions = {
  offenceCode?: string
  startDate: string
  endDate?: string
  disposalCodes?: number[]
  sequenceNumber?: number
}

export const createPNCCourtCaseOffence = ({
  offenceCode = "VG24030",
  startDate,
  endDate,
  disposalCodes,
  sequenceNumber = 1
}: CreatePNCCourtCaseOffenceOptions): PncOffence => {
  const offence: PncOffence = {
    offence: {
      acpoOffenceCode: offenceCode,
      cjsOffenceCode: offenceCode,
      startDate: parsePncDate(startDate),
      sequenceNumber
    }
  }

  if (endDate && endDate !== "") {
    offence.offence.endDate = parsePncDate(endDate)
  }

  if (disposalCodes) {
    offence.disposals = disposalCodes.map((disposalCode) => ({ type: disposalCode }))
  }

  return offence
}

export const createPNCPenaltyCaseOffence = createPNCCourtCaseOffence
