import type { Hearing } from "../../../types/AnnotatedHearingOutcome"
import getOrganisationUnit from "../../lib/organisationUnit/getOrganisationUnit"
import type { ResultedCaseMessageParsedXml, SpiDefendant } from "../../types/SpiResult"
import removeSeconds from "./removeSeconds"

type DefendantDetailsData = {
  presentAtHearing: string
  name: string
}

const getDefendantDetails = (spiDefendant: SpiDefendant): DefendantDetailsData => {
  if (spiDefendant.CourtIndividualDefendant) {
    const {
      CourtIndividualDefendant: {
        PresentAtHearing: presentAtHearing,
        PersonDefendant: {
          BasePersonDetails: {
            PersonName: { PersonGivenName1: givenName, PersonFamilyName: familyName }
          }
        }
      }
    } = spiDefendant

    const name = [givenName, familyName]
      .filter((namePart) => namePart)
      .join(" ")
      .trim()
    return { presentAtHearing, name }
  } else if (spiDefendant.CourtCorporateDefendant) {
    const {
      CourtCorporateDefendant: {
        OrganisationName: { OrganisationName: spiOrganisationName },
        PresentAtHearing: presentAtHearing
      }
    } = spiDefendant
    const name = spiOrganisationName.trim()
    return { presentAtHearing, name }
  }
  throw new Error("Defendant details contained neither CourtIndividualDefendant or CourtCorporateDefendant")
}

const populateHearing = (messageId: string, courtResult: ResultedCaseMessageParsedXml): Hearing => {
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

  const { presentAtHearing, name } = getDefendantDetails(spiDefendant)

  const hearingOutcomeHearing: Hearing = {
    CourtHearingLocation: getOrganisationUnit(spiCourtHearingLocation),
    DateOfHearing: new Date(spiDateOfHearing),
    TimeOfHearing: removeSeconds(spiTimeOfHearing),
    HearingLanguage: "D",
    HearingDocumentationLanguage: "D",
    CourtHouseCode: Number(spiPsaCode),
    SourceReference: {
      DocumentName: `SPI ${name}`,
      DocumentType: "SPI Case Result",
      UniqueID: messageId
    },
    DefendantPresentAtHearing: presentAtHearing
  }

  return hearingOutcomeHearing
}

export default populateHearing
