import type { Address, DefendantDetail, HearingDefendant } from "src/types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml, SpiAddress, SpiCourtIndividualDefendant } from "src/types/IncomingMessage"
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

  const spiGivenNames = [spiPersonGivenName1, spiPersonGivenName2, spiPersonGivenName3]
    .filter((name) => !!name)
    .map((name) => name!.trim())

  return {
    PersonName: {
      Title: spiPersonTitle?.trim(),
      GivenName: spiGivenNames,
      FamilyName: spiPersonFamilyName
    },
    BirthDate: spiBirthDate,
    Gender: spiGender.toString()
  }
}

const populateAddress = (spiAddress: SpiAddress): Address => {
  if ("SimpleAddress" in spiAddress) {
    const {
      SimpleAddress: { AddressLine1, AddressLine2, AddressLine3, AddressLine4, AddressLine5 }
    } = spiAddress

    return {
      AddressLine1: AddressLine1,
      AddressLine2: AddressLine2,
      AddressLine3: AddressLine3,
      AddressLine4: AddressLine4,
      AddressLine5: AddressLine5
    }
  } else {
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
        acc[`AddressLine${index + 1}`] = addressPart!
        return acc
      }, {})

    return hearingOutcomeAddress
  }
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

  hearingDefendant.ArrestSummonsNumber = spiDefendant.ProsecutorReference

  if (spiDefendant.CourtIndividualDefendant) {
    const {
      CourtIndividualDefendant: { PersonDefendant: spiPersonDefendant, BailStatus: spiBailStatus, Address: spiAddress }
    } = spiDefendant
    hearingDefendant.CourtPNCIdentifier = spiPersonDefendant.PNCidentifier
    hearingDefendant.DefendantDetail = populatePersonDefendantDetail(spiDefendant.CourtIndividualDefendant)
    hearingDefendant.Address = populateAddress(spiAddress)

    // RemandStatus <- BailStatus ?
    hearingDefendant.RemandStatus = populateRemandStatus(spiBailStatus)

    hearingDefendant.BailConditions =
      spiPersonDefendant.BailConditions?.split(";").map((bailCondition) => bailCondition) || []

    hearingDefendant.ReasonForBailConditions = spiPersonDefendant.ReasonForBailConditionsOrCustody
  } else if (spiDefendant.CourtCorporateDefendant) {
    // Corporate Defendant
    const {
      PNCidentifier: spiPNCidentifier,
      OrganisationName: { OrganisationName: spiOrganisationName },
      Address: spiAddress,
      BailStatus: spiBailStatus
    } = spiDefendant.CourtCorporateDefendant

    hearingDefendant.CourtPNCIdentifier = spiPNCidentifier
    hearingDefendant.OrganisationName = spiOrganisationName
    hearingDefendant.Address = populateAddress(spiAddress)

    // RemandStatus <- BailStatus ?
    hearingDefendant.RemandStatus = populateRemandStatus(spiBailStatus)

    const spiDateOfHearing = courtResult.Session.CourtHearing.Hearing.DateOfHearing
    hearingDefendant.Offence = new PopulateOffences(spiDefendant.Offence, spiDateOfHearing).execute()
  }

  return hearingDefendant
}
