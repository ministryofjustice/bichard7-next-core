import type { Address, DefendantDetail, HearingDefendant } from "src/types/HearingOutcome"
import type { ResultedCaseMessageParsedXml, SpiAddress, SpiCourtIndividualDefendant } from "src/types/IncomingMessage"
import type { ErrorAttribute } from "src/types/XmlElement"
import { createElement } from "src/types/XmlElement"
import PopulateOffences from "./PopulateOffences"

const populatePersonDefendantDetail = (spiCourtIndividualDefendant: SpiCourtIndividualDefendant): DefendantDetail => {
  const {
    PersonDefendant: {
      BasePersonDetails: {
        PersonName: {
          PersonTitle: spiPersonTitle,
          PersonGivenName1: spiPersonGivenName1,
          PersonGivenName2: spiPersonGivenName2,
          PersonGivenName3: spiPersonGivenName3,
          PersonFamilyName: spiPersonFamilyName
        },
        Gender: spiGender,
        Birthdate: spiBirthDate
      }
    }
  } = spiCourtIndividualDefendant

  const spiGivenNames = [spiPersonGivenName1, spiPersonGivenName2, spiPersonGivenName3].filter((name) => !!name)

  return {
    PersonName: {
      Title: createElement(spiPersonTitle?.trim()),
      GivenName: spiGivenNames.map((name, index) =>
        createElement((name as string).trim(), { NameSequence: `${index + 1}` })
      ),
      FamilyName: createElement(spiPersonFamilyName, { NameSequence: "1" })
    },
    BirthDate: createElement(spiBirthDate),
    Gender: createElement(spiGender.toString())
  }
}

const populateAddress = (spiAddress: SpiAddress): Address | undefined => {
  if ("SimpleAddress" in spiAddress) {
    const {
      SimpleAddress: { AddressLine1, AddressLine2, AddressLine3, AddressLine4, AddressLine5 }
    } = spiAddress

    return {
      AddressLine1: createElement(AddressLine1),
      AddressLine2: createElement(AddressLine2),
      AddressLine3: createElement(AddressLine3),
      AddressLine4: createElement(AddressLine4),
      AddressLine5: createElement(AddressLine5)
    }
  } else if ("ComplexAddress" in spiAddress) {
    const {
      ComplexAddress: { Locality, StreetDescription, Town, AdministrativeArea, UniqueStreetReferenceNumber }
    } = spiAddress

    const hearingOutcomeAddress = [
      UniqueStreetReferenceNumber?.toString(),
      StreetDescription,
      Locality,
      Town,
      AdministrativeArea
    ]
      .filter((x) => !!x)
      .reduce((acc: any, addressPart, index) => {
        acc[`AddressLine${index + 1}`] = createElement<string, ErrorAttribute>(addressPart!)
        return acc
      }, {})

    return {
      ...hearingOutcomeAddress
    }
  }

  return undefined
}

const populateRemandStatus = (spiBailStatus: string): string => {
  // RemandStatus <- BailStatus ?
  return `${spiBailStatus}: RemandStatus <- BailStatus ?`
}

export default (courtResult: ResultedCaseMessageParsedXml): HearingDefendant => {
  const hearingDefendant = {} as HearingDefendant
  const {
    Session: {
      Case: { Defendant: spiDefendant }
    }
  } = courtResult

  hearingDefendant.ArrestSummonsNumber = createElement(spiDefendant.ProsecutorReference)

  if (spiDefendant.CourtIndividualDefendant) {
    const {
      CourtIndividualDefendant: { PersonDefendant: spiPersonDefendant, BailStatus: spiBailStatus, Address: spiAddress }
    } = spiDefendant
    hearingDefendant.CourtPNCIdentifier = createElement(spiPersonDefendant.PNCidentifier)
    hearingDefendant.DefendantDetail = populatePersonDefendantDetail(spiDefendant.CourtIndividualDefendant)
    hearingDefendant.Address = populateAddress(spiAddress)

    // RemandStatus <- BailStatus ?
    hearingDefendant.RemandStatus = createElement(populateRemandStatus(spiBailStatus))

    hearingDefendant.BailConditions =
      spiPersonDefendant.BailConditions?.split(";").map((bailCondition) => createElement(bailCondition)) || []

    hearingDefendant.ReasonForBailConditions = createElement(spiPersonDefendant.ReasonForBailConditionsOrCustody)
  } else if (spiDefendant.CourtCorporateDefendant) {
    // Corporate Defendant
    const {
      PNCidentifier: spiPNCidentifier,
      OrganisationName: { OrganisationName: spiOrganisationName },
      Address: spiAddress,
      BailStatus: spiBailStatus
    } = spiDefendant.CourtCorporateDefendant

    hearingDefendant.CourtPNCIdentifier = createElement(spiPNCidentifier)
    hearingDefendant.OrganisationName = createElement(spiOrganisationName)
    hearingDefendant.Address = populateAddress(spiAddress)

    // RemandStatus <- BailStatus ?
    hearingDefendant.RemandStatus = createElement(populateRemandStatus(spiBailStatus))

    const spiDateOfHearing = courtResult.Session.CourtHearing.Hearing.DateOfHearing
    hearingDefendant.Offence = new PopulateOffences(spiDefendant.Offence, spiDateOfHearing).execute()
  }

  return hearingDefendant
}
