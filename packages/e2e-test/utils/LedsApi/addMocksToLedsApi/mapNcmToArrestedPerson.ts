import type PersonDetails from "../../../types/LedsTestApiHelper/PersonDetails"
import type ParsedNcm from "../../../types/ParsedNcm"

const mapNcmToArrestedPerson = (ncm: ParsedNcm): PersonDetails => {
  const forceOwnerCode = ncm.NewCaseMessage.Case.PTIURN.substring(0, 4)
  const personDetails = ncm.NewCaseMessage.Case.Defendant.PoliceIndividualDefendant.PersonDefendant.BasePersonDetails
  const personName = personDetails.PersonName

  return {
    lastName: personName.PersonFamilyName,
    firstNames: [personName.PersonGivenName1, personName.PersonGivenName2, personName.PersonGivenName3].filter(
      (x) => x
    ),
    dateOfBirth: personDetails.Birthdate,
    sex: personDetails.Gender === 1 ? "M" : "F",
    forceOwnerCode
  }
}

export default mapNcmToArrestedPerson
