import preProcessOffenceCode from "@moj-bichard7/core/lib/policeGateway/leds/preProcessOffenceCode"
import { randomBytes } from "node:crypto"
import type OffenceDetails from "../../../../../types/LedsTestApiHelper/OffenceDetails"
import type AddOffenceRequest from "../../../../../types/LedsTestApiHelper/Requests/AddOffenceRequest"

const generateRandomCrimeReference = () => {
  const crimeReferenceLength = 15
  const base = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-"
  const full = base + " " // Space allowed for chars 2 to N
  const bytes = randomBytes(crimeReferenceLength)
  return Array.from(bytes, (b, i) => (i === 0 ? base[b % base.length] : full[b % full.length])).join("")
}

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
      crimeReference: generateRandomCrimeReference(),
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
