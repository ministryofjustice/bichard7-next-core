import { format } from "date-fns"
import type { Hearing } from "src/types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"

const formatTime = (time: string) => {
  const date = new Date()
  const timeParts = time.split(":")
  date.setHours(parseInt(timeParts[0], 10))
  date.setMinutes(parseInt(timeParts[1], 10))

  return format(date, "HH:mm")
}

export default (messageId: string, courtResult: ResultedCaseMessageParsedXml): Hearing => {
  const {
    Session: {
      CourtHearing: {
        Hearing: {
          CourtHearingLocation: spiCourtHearingLocation,
          DateOfHearing: spiDateOfHearing,
          TimeOfHearing: spiTimeOfHearing
        },
        PSAcode: spiPsaCode
      },
      Case: { Defendant: spiDefendant }
    }
  } = courtResult

  const hearingOutcomeHearing = {} as Hearing

  hearingOutcomeHearing.CourtHearingLocation = {
    TopLevelCode: spiCourtHearingLocation?.substring(0, 1),
    SecondLevelCode: spiCourtHearingLocation?.substring(1, 3),
    ThirdLevelCode: spiCourtHearingLocation?.substring(3, 5),
    BottomLevelCode: spiCourtHearingLocation?.substring(5, 7),
    OrganisationUnitCode: spiCourtHearingLocation
  }

  hearingOutcomeHearing.DateOfHearing = spiDateOfHearing
  hearingOutcomeHearing.TimeOfHearing = formatTime(spiTimeOfHearing)
  hearingOutcomeHearing.HearingLanguage = "D"
  hearingOutcomeHearing.HearingDocumentationLanguage = "D"

  let name = ""
  if (spiDefendant.CourtIndividualDefendant) {
    const {
      CourtIndividualDefendant: {
        PresentAtHearing: spiPresentAtHearing,
        PersonDefendant: {
          BasePersonDetails: {
            PersonName: { PersonGivenName1: givenName, PersonFamilyName: familyName }
          }
        }
      }
    } = spiDefendant

    hearingOutcomeHearing.DefendantPresentAtHearing = spiPresentAtHearing
    name = [givenName, familyName].filter((namePart) => namePart).join(" ")
  } else if (spiDefendant.CourtCorporateDefendant) {
    name = spiDefendant.CourtCorporateDefendant.OrganisationName.OrganisationName
  }
  hearingOutcomeHearing.SourceReference = {
    DocumentName: `SPI ${name}`,
    DocumentType: "SPI Case Result",
    UniqueID: messageId
  }

  hearingOutcomeHearing.CourtHouseCode = spiPsaCode

  return hearingOutcomeHearing
}
