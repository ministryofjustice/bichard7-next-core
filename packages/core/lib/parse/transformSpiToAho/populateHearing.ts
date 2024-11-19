import type { Hearing } from "../../../types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml, SpiDefendant } from "../../../types/SpiResult"

import getOrganisationUnit from "../../getOrganisationUnit"
import removeSeconds from "./removeSeconds"

type DefendantDetailsData = {
  name: string
  presentAtHearing: string
}

const getDefendantDetails = (spiDefendant: SpiDefendant): DefendantDetailsData => {
  if (spiDefendant.CourtIndividualDefendant) {
    const {
      CourtIndividualDefendant: {
        PersonDefendant: {
          BasePersonDetails: {
            PersonName: { PersonFamilyName: familyName, PersonGivenName1: givenName }
          }
        },
        PresentAtHearing: presentAtHearing
      }
    } = spiDefendant

    const name = [givenName, familyName]
      .filter((namePart) => namePart)
      .join(" ")
      .trim()
    return { name, presentAtHearing }
  } else if (spiDefendant.CourtCorporateDefendant) {
    const {
      CourtCorporateDefendant: {
        OrganisationName: { OrganisationName: spiOrganisationName },
        PresentAtHearing: presentAtHearing
      }
    } = spiDefendant
    const name = spiOrganisationName.trim()
    return { name, presentAtHearing }
  }

  throw new Error("Defendant details contained neither CourtIndividualDefendant or CourtCorporateDefendant")
}

const populateHearing = (messageId: string, courtResult: ResultedCaseMessageParsedXml): Hearing => {
  const {
    Session: {
      Case: { Defendant: spiDefendant },
      CourtHearing: {
        Hearing: {
          CourtHearingLocation: spiCourtHearingLocation,
          DateOfHearing: spiDateOfHearing,
          TimeOfHearing: spiTimeOfHearing
        },
        PSAcode: spiPsaCode
      }
    }
  } = courtResult

  const { name, presentAtHearing } = getDefendantDetails(spiDefendant)

  const hearingOutcomeHearing: Hearing = {
    CourtHearingLocation: getOrganisationUnit(spiCourtHearingLocation),
    CourtHouseCode: Number(spiPsaCode),
    DateOfHearing: new Date(spiDateOfHearing),
    DefendantPresentAtHearing: presentAtHearing,
    HearingDocumentationLanguage: "D",
    HearingLanguage: "D",
    SourceReference: {
      DocumentName: `SPI ${name}`,
      DocumentType: "SPI Case Result",
      UniqueID: messageId
    },
    TimeOfHearing: removeSeconds(spiTimeOfHearing)
  }

  return hearingOutcomeHearing
}

export default populateHearing
