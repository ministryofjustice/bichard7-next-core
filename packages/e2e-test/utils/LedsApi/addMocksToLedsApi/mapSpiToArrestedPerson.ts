import type { IncomingMessageParsedXml } from "@moj-bichard7/common/types/SpiResult"
import type PersonDetails from "../../../types/LedsTestApiHelper/PersonDetails"

const mapSpiToArrestedPerson = (spi: IncomingMessageParsedXml): PersonDetails => {
  const { Case: spiCase } = spi.DeliverRequest.Message.ResultedCaseMessage.Session
  const forceOwnerCode = spiCase.PTIURN.substring(0, 4)
  const personDetails = spiCase.Defendant.CourtIndividualDefendant?.PersonDefendant.BasePersonDetails
  if (!personDetails) {
    throw Error("Corporation defendant support not implemented.")
  }

  const personName = personDetails?.PersonName

  return {
    lastName: personName.PersonFamilyName,
    firstNames: [personName.PersonGivenName1, personName.PersonGivenName2, personName.PersonGivenName3].filter(
      (x) => x
    ) as string[],
    dateOfBirth: personDetails.Birthdate ?? "1980-01-01",
    sex: String(personDetails.Gender) === "1" ? "M" : "F",
    forceOwnerCode
  }
}

export default mapSpiToArrestedPerson
