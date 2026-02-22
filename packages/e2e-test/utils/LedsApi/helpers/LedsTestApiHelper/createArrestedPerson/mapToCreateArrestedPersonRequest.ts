import type OffenceDetails from "../../../../../types/LedsTestApiHelper/OffenceDetails"
import type PersonDetails from "../../../../../types/LedsTestApiHelper/PersonDetails"
import type CreateArrestedPersonRequest from "../../../../../types/LedsTestApiHelper/Requests/CreateArrestedPersonRequest"
import mapToAddOffenceRequest from "../addOffence/mapToAddOffenceRequest"

const mapToCreateArrestedPersonRequest = (
  person: PersonDetails,
  firstOffence: OffenceDetails,
  checkName: string
): CreateArrestedPersonRequest => {
  const offence = mapToAddOffenceRequest(firstOffence, checkName).content

  return {
    person: {
      lastName: person.lastName,
      firstNames: person.firstNames,
      dateOfBirth: person.dateOfBirth,
      sex: person.sex,
      skinColour: null,
      heightType: null,
      metricHeight: null,
      heightInFeet: null,
      heightInInches: null
    },
    arrestReport: {
      fsCodeMakingChange: person.forceOwnerCode,
      content: {
        arrestFirstNames: person.firstNames,
        arrestLastName: person.lastName,
        arrestDob: person.dateOfBirth,
        processStage: "A",
        processStageDate: firstOffence.startDate,
        processStageTime: null,
        ownerCode: person.forceOwnerCode,
        prosecutingAgent: "CPS",
        arrestingOfficer: {
          division: "HQ",
          lastName: "Test Officer",
          rankCode: "COMM",
          number: 51843
        },
        photoAvailable: false,
        dateOfPhoto: null,
        photoForceLocation: null,
        fingerprintStatusGroup: {
          statusCode: "T",
          forceLocation: null
        },
        dnaStatusCode: "N",
        dnaLaboratory: null,
        dnaForceLocation: null,
        sampleBarcode: null,
        dnaSampleDate: null,
        dnaSampleType: null,
        forceDNAReferencePrefix: null,
        forceDnaReferenceId: null,
        offence,
        caseDetailText: []
      },
      checkname: checkName
    }
  }
}

export default mapToCreateArrestedPersonRequest
