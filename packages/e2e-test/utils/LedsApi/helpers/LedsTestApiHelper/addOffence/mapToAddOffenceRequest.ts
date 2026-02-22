import type OffenceDetails from "../../../../../types/LedsTestApiHelper/OffenceDetails"
import type AddOffenceRequest from "../../../../../types/LedsTestApiHelper/Requests/AddOffenceRequest"

const mapToAddOffenceRequest = (offence: OffenceDetails, checkName: string): AddOffenceRequest => {
  return {
    content: {
      committedOnBail: "false",
      ownerCode: offence.ownerCode,
      startDate: offence.startDate,
      startTime: offence.startTime ?? "",
      locationFSCode: offence.ownerCode,
      roleQualifier: null,
      legislationQualifier: null,
      endDate: offence.endDate ?? "",
      endTime: offence.endTime ?? "",
      crimeReference: "",
      offenceLocation: {
        locationType: "text",
        locationText: offence.offenceLocation
      },
      offenceCode: {
        offenceCodeType: "cjs",
        cjsOffenceCode: offence.offenceCode
      }
    },
    changedBy: offence.ownerCode,
    checkname: checkName
  }
}

export default mapToAddOffenceRequest
