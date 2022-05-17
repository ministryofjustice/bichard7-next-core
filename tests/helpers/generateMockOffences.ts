import parsePncDate from "src/lib/parsePncDate"
import type { Offence, Result } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"

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
  courtCaseReferenceNumber
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
      OffenceReasonSequence: sequenceNumber
    },
    ActualOffenceStartDate: {
      StartDate: new Date(startDate)
    },
    Result: resultCodes?.map(
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
    ),
    OffenceCategory: offenceCategory,
    CourtCaseReferenceNumber: courtCaseReferenceNumber
  }

  if (!!endDate) {
    offence.ActualOffenceEndDate = {
      EndDate: new Date(endDate)
    }
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
