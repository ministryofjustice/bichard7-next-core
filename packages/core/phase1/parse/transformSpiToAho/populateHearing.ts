import type { ResultedCaseMessageParsedXml } from "phase1/types/SpiResult"
import type { Hearing } from "types/AnnotatedHearingOutcome"
import getOrganisationUnit from "../../lib/organisationUnit/getOrganisationUnit"
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
    name = [givenName, familyName]
      .filter((namePart) => namePart)
      .join(" ")
      .trim()
  } else if (spiDefendant.CourtCorporateDefendant) {
    const {
      CourtCorporateDefendant: {
        OrganisationName: { OrganisationName: spiOrganisationName },
        PresentAtHearing: spiPresentAtHearing
      }
    } = spiDefendant
    name = spiOrganisationName.trim()
    hearingOutcomeHearing.DefendantPresentAtHearing = spiPresentAtHearing
  }
  hearingOutcomeHearing.SourceReference = {
    DocumentName: `SPI ${name}`,
    DocumentType: "SPI Case Result",
    UniqueID: messageId
  }

  hearingOutcomeHearing.CourtHouseCode = Number(spiPsaCode)

  return hearingOutcomeHearing
}
