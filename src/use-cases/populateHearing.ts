import { format } from "date-fns"
import type { Hearing } from "src/types/HearingOutcome"
import type { ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import { createElement } from "src/types/XmlElement"
import formatXmlDate from "src/utils/formatXmlDate"

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
    OrganisationUnitCode: createElement(spiCourtHearingLocation)
  }

  hearingOutcomeHearing.DateOfHearing = createElement(formatXmlDate(spiDateOfHearing))
  hearingOutcomeHearing.TimeOfHearing = createElement(formatTime(spiTimeOfHearing))
  hearingOutcomeHearing.HearingLanguage = createElement("D")
  hearingOutcomeHearing.HearingDocumentationLanguage = createElement("D")

  const spiPresentAtHearing = spiDefendant.CourtIndividualDefendant
    ? spiDefendant.CourtIndividualDefendant.PresentAtHearing
    : spiDefendant.CourtCorporateDefendant.PresentAtHearing
  hearingOutcomeHearing.DefendantPresentAtHearing = createElement(spiPresentAtHearing)

  let name = ""
  if (spiDefendant.CourtIndividualDefendant) {
    const {
      PersonName: { PersonGivenName1: givenName, PersonFamilyName: familyName }
    } = spiDefendant.CourtIndividualDefendant.PersonDefendant.BasePersonDetails

    name = [givenName, familyName].filter((namePart) => namePart).join(" ")
  } else {
    name = spiDefendant.CourtCorporateDefendant.OrganisationName.OrganisationName
  }
  hearingOutcomeHearing.SourceReference = {
    DocumentName: createElement(`SPI ${name}`),
    DocumentType: createElement("SPI Case Result"),
    UniqueID: createElement(messageId)
  }

  hearingOutcomeHearing.CourtHouseCode = createElement(spiPsaCode)

  return hearingOutcomeHearing
}
