import type OffenceDetails from "../../../../types/LedsTestApi/OffenceDetails"
import type PersonDetails from "../../../../types/LedsTestApi/PersonDetails"
import type CreateArrestedPersonRequest from "../../../../types/LedsTestApi/Requests/CreateArrestedPersonRequest"
import mapToAddOffenceRequest from "./mapToAddOffenceRequest"

const mapToCreateArrestedPersonRequest = (
  person: PersonDetails,
  firstOffence: OffenceDetails,
  checkname: string
): CreateArrestedPersonRequest => {
  const offence = mapToAddOffenceRequest(firstOffence, checkname).content

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
      checkname
    }
  }
}

export default mapToCreateArrestedPersonRequest
