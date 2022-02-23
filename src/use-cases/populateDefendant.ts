import type { Address, DefendantDetail, HearingDefendant } from "src/types/HearingOutcome"
import type { ResultedCaseMessageParsedXml, SpiAddress } from "src/types/IncomingMessage"
import type { ErrorAttribute } from "src/types/XmlElement"
import { createElement } from "src/types/XmlElement"
import PopulateOffences from "./PopulateOffences"

const populatePersonDefendantDetail = (courtResult: ResultedCaseMessageParsedXml): DefendantDetail => {
  const {
    PersonName: {
      PersonTitle: spiPersonTitle,
      PersonGivenName1: spiPersonGivenName1,
      PersonGivenName2: spiPersonGivenName2,
      PersonGivenName3: spiPersonGivenName3,
      PersonFamilyName: spiPersonFamilyName
    },
    Gender: spiGender,
    Birthdate: spiBirthDate
  } = courtResult.Session.Case.Defendant.CourtIndividualDefendant.PersonDefendant.BasePersonDetails

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
    Gender: createElement(spiGender)
  }
}

const populateAddress = (spiAddress: SpiAddress): Address | undefined => {
  if (spiAddress?.SimpleAddress) {
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
  } else if (spiAddress?.ComplexAddress) {
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
        acc[`AddressLine${index + 1}`] = createElement<string, ErrorAttribute>(addressPart)
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

  const { CourtIndividualDefendant: spiIndividualDefendant } = spiDefendant
  if (spiIndividualDefendant) {
    const { PersonDefendant: spiPersonDefendant, BailStatus: spiBailStatus } = spiIndividualDefendant
    hearingDefendant.CourtPNCIdentifier = createElement(spiPersonDefendant.PNCidentifier)
    hearingDefendant.DefendantDetail = populatePersonDefendantDetail(courtResult)
    hearingDefendant.Address = populateAddress(spiIndividualDefendant.Address)

    // RemandStatus <- BailStatus ?
    hearingDefendant.RemandStatus = createElement(populateRemandStatus(spiBailStatus))

    hearingDefendant.BailConditions =
      spiPersonDefendant.BailConditions?.split(";").map((bailCondition) => createElement(bailCondition)) || []

    hearingDefendant.ReasonForBailConditions = createElement(spiPersonDefendant.ReasonForBailConditionsOrCustody)
  } else {
    // Corporate Defendant
    const { CourtCorporateDefendant: spiCorporateDefendant } = spiDefendant

    hearingDefendant.CourtPNCIdentifier = createElement(spiCorporateDefendant.PNCidentifier)
    hearingDefendant.OrganisationName = createElement(spiCorporateDefendant.OrganisationName.OrganisationName)
    hearingDefendant.Address = populateAddress(spiCorporateDefendant.Address)

    // RemandStatus <- BailStatus ?
    hearingDefendant.RemandStatus = createElement(populateRemandStatus(spiCorporateDefendant.BailStatus))

    const spiDateOfHearing = courtResult.Session.CourtHearing.Hearing.DateOfHearing
    hearingDefendant.Offence = new PopulateOffences(spiDefendant.Offence, spiDateOfHearing).execute()
  }

  return hearingDefendant
}
