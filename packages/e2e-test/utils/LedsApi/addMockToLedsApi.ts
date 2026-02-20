import { organisationUnit } from "@moj-bichard7-developers/bichard7-next-data"
import { XMLParser } from "fast-xml-parser"
import fs from "fs"
import path from "path"
import type { LedsBichard, LedsMock } from "../../types/LedsMock"
import type { NonEmptyCourtCaseArray } from "../../types/LedsTestApi/CourtCase"
import type { NonEmptyOffenceDetailsArray } from "../../types/LedsTestApi/OffenceDetails"
import type PersonDetails from "../../types/LedsTestApi/PersonDetails"
import type ParsedNcm from "../../types/ParsedNcm"
import { extractAllTags } from "../tagProcessing"
import type Bichard from "../world"

type MockRequestsAndResponses = (ncmFile: string, bichard: Bichard) => LedsMock[]

const messageFilePatterns = ["pnc-data.xml", "input-message.xml", "input-message-\\d\\.xml"]
const parser = new XMLParser()

const readNcmFile = (bichard: LedsBichard): ParsedNcm => {
  const files = fs.readdirSync(bichard.specFolder)
  const filePattern = messageFilePatterns.find((pattern) => files.some((file) => new RegExp(pattern).test(file)))
  const messageFile = filePattern && files.find((file) => new RegExp(filePattern).test(file))
  if (!messageFile) {
    throw new Error("No input message files found")
  }

  const xmlData = fs.readFileSync(path.join(bichard.specFolder, messageFile), "utf8").toString()
  extractAllTags(bichard, xmlData)

  return parser.parse(xmlData) as ParsedNcm
}

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

const mapNcmToCourtCases = (ncm: ParsedNcm): NonEmptyCourtCaseArray => {
  const forceOwnerCode = ncm.NewCaseMessage.Case.PTIURN.substring(0, 4)
  const hearingLocation = ncm.NewCaseMessage.Case.InitialHearing.CourtHearingLocation
  const courtOrganisationUnit = organisationUnit.find(
    (ou) =>
      ou.topLevelCode === hearingLocation[0] &&
      ou.secondLevelCode === hearingLocation.substring(1, 3) &&
      ou.thirdLevelCode === hearingLocation.substring(3, 5)
  )
  const courtName = [
    courtOrganisationUnit?.topLevelName,
    courtOrganisationUnit?.secondLevelName,
    courtOrganisationUnit?.thirdLevelName
  ]
    .filter((x) => x)
    .join(" ")
  const dateOfHearing = ncm.NewCaseMessage.Case.InitialHearing.DateOfHearing
  const courtHearingLocation = ncm.NewCaseMessage.Case.InitialHearing.CourtHearingLocation
  const ncmOffences = Array.isArray(ncm.NewCaseMessage.Case.Defendant.Offence)
    ? ncm.NewCaseMessage.Case.Defendant.Offence
    : [ncm.NewCaseMessage.Case.Defendant.Offence]

  const offences: NonEmptyOffenceDetailsArray = ncmOffences.map((ncmOffence) => {
    const ncmResults = !ncmOffence.Result
      ? []
      : Array.isArray(ncmOffence.Result)
        ? ncmOffence.Result
        : [ncmOffence.Result]

    return {
      ownerCode: forceOwnerCode,
      startDate: ncmOffence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate,
      startTime: undefined,
      endDate: undefined,
      endTime: undefined,
      offenceLocation: ncmOffence.BaseOffenceDetails.LocationOfOffence,
      offenceCode: ncmOffence.BaseOffenceDetails.OffenceCode,
      convictionDate: ncmOffence.ConvictionDate,
      verdict: ncmOffence.Finding,
      plea: ncmOffence.Plea,
      results:
        ncmResults.map((result) => ({
          resultCode: result.ResultCode,
          resultText: result.ResultText,
          disposalEffectiveDate: result.DisposalEffectiveDate
        })) ?? []
    }
  }) as NonEmptyOffenceDetailsArray

  return [
    {
      dateOfHearing,
      courtHearingLocation,
      offences,
      court: {
        courtIdentityType: "name",
        courtName
      }
    }
  ]
}

const addMockToLedsApi = async (bichard: LedsBichard): Promise<void> => {
  const mockRequestsAndResponses: MockRequestsAndResponses = (await import(`${bichard.specFolder}/mock-pnc-responses`))
    .default
  bichard.policeApi.mocks = mockRequestsAndResponses(`${bichard.specFolder}/pnc-data.xml`, bichard)

  const ncm = readNcmFile(bichard)
  const arrestedPerson = mapNcmToArrestedPerson(ncm)
  const courtCases = mapNcmToCourtCases(ncm)

  const asn = await bichard.policeApi.ledsTestApiHelper.createArrestedPersonAndDisposals(arrestedPerson, courtCases)

  console.log(asn)
}

export default addMockToLedsApi
