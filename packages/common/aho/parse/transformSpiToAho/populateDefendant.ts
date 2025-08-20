import type { Address, DefendantDetail, HearingDefendant } from "../../../types/AnnotatedHearingOutcome"
import type {
  ResultedCaseMessageParsedXml,
  SpiAddress,
  SpiCourtIndividualDefendant,
  SpiDefendant
} from "../../../types/SpiResult"

import { lookupRemandStatusBySpiCode } from "../../dataLookup/dataLookup"
import populateOffences from "./populateOffences"

const formatPncIdentifier = (spiPNCIdentifier?: string): string | undefined =>
  spiPNCIdentifier ? spiPNCIdentifier.substring(0, 4) + "/" + spiPNCIdentifier.substring(4) : undefined

const populatePersonDefendantDetail = (spiCourtIndividualDefendant: SpiCourtIndividualDefendant): DefendantDetail => {
  const {
    PersonDefendant: {
      BasePersonDetails: {
        Birthdate: spiBirthDate,
        Gender: spiGender,
        PersonName: {
          PersonFamilyName: spiPersonFamilyName,
          PersonGivenName1: spiPersonGivenName1,
          PersonGivenName2: spiPersonGivenName2,
          PersonGivenName3: spiPersonGivenName3,
          PersonTitle: spiPersonTitle
        }
      }
    }
  } = spiCourtIndividualDefendant

  const spiGivenNames = [spiPersonGivenName1, spiPersonGivenName2, spiPersonGivenName3]
    .filter((name) => name !== undefined && name.trim() !== "")
    .map((name) => name!.trim())
    .map((name) => name.replace(/\s+/g, " "))

  return {
    BirthDate: spiBirthDate ? new Date(spiBirthDate) : undefined,
    Gender: Number(spiGender),
    PersonName: {
      FamilyName: spiPersonFamilyName.replace(/\s+/g, " ").trim(),
      GivenName: spiGivenNames,
      Title: spiPersonTitle?.trim() || undefined
    }
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
      ComplexAddress: { AdministrativeArea, Locality, StreetDescription, Town, UniqueStreetReferenceNumber }
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
  | Pick<HearingDefendant, "Address" | "BailConditions" | "OrganisationName" | "PNCIdentifier" | "RemandStatus">
  | Pick<
      HearingDefendant,
      | "Address"
      | "BailConditions"
      | "CourtPNCIdentifier"
      | "DefendantDetail"
      | "ReasonForBailConditions"
      | "RemandStatus"
    >

const processDefendant = (spiDefendant: SpiDefendant): PartialDefendantDetails => {
  if (spiDefendant.CourtIndividualDefendant) {
    const {
      CourtIndividualDefendant: {
        Address: spiAddress,
        BailStatus: spiBailStatus,
        PersonDefendant: { BailConditions: spiBailConditions, PNCidentifier: spiPNCidentifier },
        ReasonForBailConditionsOrCustody: spiReasonForBailConditionsOrCustody
      }
    } = spiDefendant

    return {
      Address: populateAddress(spiAddress),
      BailConditions: parseBailConditions(spiBailConditions),
      CourtPNCIdentifier: formatPncIdentifier(spiPNCidentifier),
      DefendantDetail: populatePersonDefendantDetail(spiDefendant.CourtIndividualDefendant),
      ReasonForBailConditions: spiReasonForBailConditionsOrCustody,
      RemandStatus: lookupRemandStatusBySpiCode(spiBailStatus)?.cjsCode ?? spiBailStatus
    }
  }

  if (spiDefendant.CourtCorporateDefendant) {
    // Corporate Defendant
    const {
      Address: spiAddress,
      BailStatus: spiBailStatus,
      OrganisationName: { OrganisationName: spiOrganisationName },
      PNCidentifier: spiPNCidentifier
    } = spiDefendant.CourtCorporateDefendant

    return {
      Address: populateAddress(spiAddress),
      BailConditions: [],
      CourtPNCIdentifier: formatPncIdentifier(spiPNCidentifier),
      OrganisationName: spiOrganisationName,
      RemandStatus: lookupRemandStatusBySpiCode(spiBailStatus)?.cjsCode ?? spiBailStatus
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

  const { bailConditions, offences } = populateOffences(courtResult)

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
