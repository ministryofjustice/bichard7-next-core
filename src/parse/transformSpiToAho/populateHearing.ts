import getOrganisationUnit from "src/lib/organisationUnit/getOrganisationUnit"
import type { Hearing } from "src/types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml } from "src/types/SpiResult"
import removeSeconds from "./removeSeconds"

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

  hearingOutcomeHearing.CourtHearingLocation = getOrganisationUnit(spiCourtHearingLocation)

  hearingOutcomeHearing.DateOfHearing = new Date(spiDateOfHearing)
  hearingOutcomeHearing.TimeOfHearing = removeSeconds(spiTimeOfHearing)
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
    name = [givenName.trim(), familyName.trim()].filter((namePart) => namePart).join(" ")
  } else if (spiDefendant.CourtCorporateDefendant) {
    name = spiDefendant.CourtCorporateDefendant.OrganisationName.OrganisationName
  }
  hearingOutcomeHearing.SourceReference = {
    DocumentName: `SPI ${name}`,
    DocumentType: "SPI Case Result",
    UniqueID: messageId
  }

  hearingOutcomeHearing.CourtHouseCode = Number(spiPsaCode)

  return hearingOutcomeHearing
}
