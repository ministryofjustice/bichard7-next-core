import type { Offence, Result } from "../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../types/PncQueryResult"

import parsePncDate from "../../../lib/parsePncDate"

export type CreateHoOffenceOptions = {
  actOrSource?: string
  courtCaseReferenceNumber?: string
  endDate?: string
  manualSequenceNumber?: number
  offenceCategory?: string
  offenceDateCode?: string
  reason?: string
  resultCodes?: string[]
  sequenceNumber?: number
  startDate: string
  year?: string
}

export const createHOOffence = ({
  actOrSource = "VG",
  courtCaseReferenceNumber,
  endDate,
  manualSequenceNumber,
  offenceCategory,
  offenceDateCode,
  reason = "030",
  resultCodes,
  sequenceNumber,
  startDate,
  year = "24"
}: CreateHoOffenceOptions): Offence => {
  const offence: Partial<Offence> = {
    ActualOffenceDateCode: offenceDateCode,
    ActualOffenceStartDate: {
      StartDate: new Date(startDate)
    },
    CourtCaseReferenceNumber: courtCaseReferenceNumber,
    CriminalProsecutionReference: {
      DefendantOrOffender: {
        CheckDigit: "",
        DefendantOrOffenderSequenceNumber: "",
        OrganisationUnitIdentifierCode: {
          BottomLevelCode: "00",
          OrganisationUnitCode: "B01EF00",
          SecondLevelCode: "01",
          ThirdLevelCode: "EF",
          TopLevelCode: "B"
        },
        Year: ""
      },
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: actOrSource,
          FullCode: `${actOrSource}${year}${reason}`,
          Reason: reason,
          Year: year
        }
      },
      OffenceReasonSequence: sequenceNumber?.toString()
    },
    OffenceCategory: offenceCategory,
    Result: resultCodes
      ? resultCodes.map(
          (code): Result => ({
            CJSresultCode: parseInt(code, 10),
            ResultQualifierVariable: [{ Code: "A" }],
            SourceOrganisation: {
              BottomLevelCode: "00",
              OrganisationUnitCode: "01OK00",
              SecondLevelCode: "01",
              ThirdLevelCode: "OK"
            }
          })
        )
      : []
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
  disposalCodes?: number[]
  endDate?: string
  offenceCode?: string
  sequenceNumber?: number
  startDate: string
}

export const createPNCCourtCaseOffence = ({
  disposalCodes,
  endDate,
  offenceCode = "VG24030",
  sequenceNumber = 1,
  startDate
}: CreatePNCCourtCaseOffenceOptions): PncOffence => {
  const offence: PncOffence = {
    offence: {
      acpoOffenceCode: offenceCode,
      cjsOffenceCode: offenceCode,
      sequenceNumber,
      startDate: parsePncDate(startDate)
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
