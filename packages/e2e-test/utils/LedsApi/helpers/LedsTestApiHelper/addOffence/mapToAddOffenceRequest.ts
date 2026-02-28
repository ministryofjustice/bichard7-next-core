import preProcessOffenceCode from "@moj-bichard7/core/lib/policeGateway/leds/preProcessOffenceCode"
import type OffenceDetails from "../../../../../types/LedsTestApiHelper/OffenceDetails"
import type AddOffenceRequest from "../../../../../types/LedsTestApiHelper/Requests/AddOffenceRequest"

const mapToAddOffenceRequest = (offence: OffenceDetails, checkName: string): AddOffenceRequest => {
  const { offenceCode: cjsOffenceCode, roleQualifier } = preProcessOffenceCode(offence.offenceCode)

  return {
    content: {
      committedOnBail: "false",
      ownerCode: offence.ownerCode,
      startDate: offence.startDate,
      startTime: offence.startTime ?? "",
      locationFSCode: offence.ownerCode,
      roleQualifier,
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
        cjsOffenceCode
      }
    },
    changedBy: offence.ownerCode,
    checkname: checkName
  }
}

export default mapToAddOffenceRequest
