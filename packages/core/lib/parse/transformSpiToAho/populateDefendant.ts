import type {
  ResultedCaseMessageParsedXml,
  SpiAddress,
  SpiCourtIndividualDefendant,
  SpiDefendant
} from "../../../phase1/types/SpiResult"
import type { Address, DefendantDetail, HearingDefendant } from "../../../types/AnnotatedHearingOutcome"
import { lookupRemandStatusBySpiCode } from "../../dataLookup"
import populateOffences from "./populateOffences"

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
    .filter((name) => name !== undefined && name.trim() !== "")
    .map((name) => name!.trim())
    .map((name) => name.replace(/\s+/g, " "))

  return {
    PersonName: {
      Title: spiPersonTitle?.trim() || undefined,
      GivenName: spiGivenNames,
      FamilyName: spiPersonFamilyName.replace(/\s+/g, " ").trim()
    },
    BirthDate: spiBirthDate ? new Date(spiBirthDate) : undefined,
    Gender: Number(spiGender)
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc: any, addressPart, index) => {
        acc[`AddressLine${index + 1}`] = addressPart!
        return acc
      }, {})

    return hearingOutcomeAddress
  }
}

const parseBailConditions = (spiBailConditions?: string): string[] => {
  if (spiBailConditions && spiBailConditions !== "") {
    return spiBailConditions
      .split(";")
      .map((cond) => cond.trim())
      .filter((cond) => !!cond)
  }

  return []
}

type PartialDefendantDetails =
  | Pick<
      HearingDefendant,
      | "CourtPNCIdentifier"
      | "DefendantDetail"
      | "Address"
      | "RemandStatus"
      | "BailConditions"
      | "ReasonForBailConditions"
    >
  | Pick<HearingDefendant, "PNCIdentifier" | "OrganisationName" | "Address" | "RemandStatus" | "BailConditions">

const processDefendant = (spiDefendant: SpiDefendant): PartialDefendantDetails => {
  if (spiDefendant.CourtIndividualDefendant) {
    const {
      CourtIndividualDefendant: {
        PersonDefendant: { PNCidentifier: spiPNCidentifier, BailConditions: spiBailConditions },
        BailStatus: spiBailStatus,
        Address: spiAddress,
        ReasonForBailConditionsOrCustody: spiReasonForBailConditionsOrCustody
      }
    } = spiDefendant

    return {
      CourtPNCIdentifier: formatPncIdentifier(spiPNCidentifier),
      DefendantDetail: populatePersonDefendantDetail(spiDefendant.CourtIndividualDefendant),
      Address: populateAddress(spiAddress),
      RemandStatus: lookupRemandStatusBySpiCode(spiBailStatus)?.cjsCode ?? spiBailStatus,
      BailConditions: parseBailConditions(spiBailConditions),
      ReasonForBailConditions: spiReasonForBailConditionsOrCustody
    }
  }

  if (spiDefendant.CourtCorporateDefendant) {
    // Corporate Defendant
    const {
      PNCidentifier: spiPNCidentifier,
      OrganisationName: { OrganisationName: spiOrganisationName },
      Address: spiAddress,
      BailStatus: spiBailStatus
    } = spiDefendant.CourtCorporateDefendant

    return {
      CourtPNCIdentifier: formatPncIdentifier(spiPNCidentifier),
      OrganisationName: spiOrganisationName,
      Address: populateAddress(spiAddress),
      RemandStatus: lookupRemandStatusBySpiCode(spiBailStatus)?.cjsCode ?? spiBailStatus,
      BailConditions: []
    }
  }

  throw new Error("CourtIndividualDefendant and CourtCorporateDefendant are missing from incoming record")
}

export default (courtResult: ResultedCaseMessageParsedXml): HearingDefendant => {
  const {
    Session: {
      Case: { Defendant: spiDefendant }
    }
  } = courtResult

  const { offences, bailConditions } = populateOffences(courtResult)

  const partialDefendant = processDefendant(spiDefendant)

  if (partialDefendant.BailConditions.length > 0) {
    partialDefendant.BailConditions = partialDefendant.BailConditions.concat(bailConditions)
  }

  const hearingDefendant: HearingDefendant = {
    ...partialDefendant,
    ArrestSummonsNumber: spiDefendant.ProsecutorReference,
    Offence: offences
  }

  return hearingDefendant
}
