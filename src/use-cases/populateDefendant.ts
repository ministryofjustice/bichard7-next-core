import type { Address, DefendantDetail, HearingDefendant } from "src/types/AnnotatedHearingOutcome"
import type { ResultedCaseMessageParsedXml, SpiAddress, SpiCourtIndividualDefendant } from "src/types/IncomingMessage"
import { lookupRemandStatusBySpiCode } from "./dataLookup"
import PopulateOffences from "./PopulateOffences"

const formatPncIdentifier = (spiPNCIdentifier?: string): string | undefined =>
  spiPNCIdentifier ? spiPNCIdentifier.substring(0, 4) + "/" + spiPNCIdentifier.substring(4) : undefined

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
      CourtIndividualDefendant: {
        PersonDefendant: {
          PNCidentifier: spiPNCidentifier,
          BailConditions: spiBailConditions,
          ReasonForBailConditionsOrCustody: spiReasonForBailConditionsOrCustody
        },
        BailStatus: spiBailStatus,
        Address: spiAddress
      }
    } = spiDefendant
    hearingDefendant.CourtPNCIdentifier = formatPncIdentifier(spiPNCidentifier)
    hearingDefendant.DefendantDetail = populatePersonDefendantDetail(spiDefendant.CourtIndividualDefendant)
    hearingDefendant.Address = populateAddress(spiAddress)
    hearingDefendant.RemandStatus = lookupRemandStatusBySpiCode(spiBailStatus)?.cjsCode ?? spiBailStatus
    hearingDefendant.BailConditions = spiBailConditions?.split(";").map((bailCondition) => bailCondition) || []
    hearingDefendant.ReasonForBailConditions = spiReasonForBailConditionsOrCustody
  } else if (spiDefendant.CourtCorporateDefendant) {
    // Corporate Defendant
    const {
      PNCidentifier: spiPNCidentifier,
      OrganisationName: { OrganisationName: spiOrganisationName },
      Address: spiAddress,
      BailStatus: spiBailStatus
    } = spiDefendant.CourtCorporateDefendant

    hearingDefendant.CourtPNCIdentifier = formatPncIdentifier(spiPNCidentifier)
    hearingDefendant.OrganisationName = spiOrganisationName
    hearingDefendant.Address = populateAddress(spiAddress)
    hearingDefendant.RemandStatus = lookupRemandStatusBySpiCode(spiBailStatus)?.cjsCode ?? spiBailStatus
  }

  const { offences, bailConditions } = new PopulateOffences(courtResult, hearingDefendant.BailConditions).execute()

  hearingDefendant.Offence = offences
  hearingDefendant.BailConditions = bailConditions

  return hearingDefendant
}
