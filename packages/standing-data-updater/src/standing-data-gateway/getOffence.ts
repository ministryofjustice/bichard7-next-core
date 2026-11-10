import axios from "axios"
import https from "https"
import { v4 as uuidv4 } from "uuid"
import { getOffenceApiResultSchema } from "../schemas/standingDataAPIResult"
import type { ApiOffence } from "../types/StandingDataAPIResult"
import { config } from "./config"

export const getOffence = async (alphaChar: string): Promise<ApiOffence[] | Error> => {
  try {
    const result = await axios.post(
      config.endPoint,
      {
        MessageHeader: {
          MessageID: {
            UUID: uuidv4(),
            RelatesTo: ""
          },
          TimeStamp: new Date(),
          MessageType: "GetOffence",
          From: "CONSUMER_APPLICATION",
          To: "SDRS_AZURE"
        },
        MessageBody: {
          GatewayOperationType: {
            GetOffenceRequest: {
              CJSCode: null,
              AlphaChar: alphaChar,
              AllOffences: "ALL",
              ChangedDate: null
            }
          }
        }
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        auth: {
          username: config.username,
          password: config.password
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      }
    )
    const parsedApiResult = getOffenceApiResultSchema.parse(result.data)

    return parsedApiResult.MessageBody.GatewayOperationType.GetOffenceResponse.Offence
  } catch (error: unknown) {
    console.log(`error with ${alphaChar}`)

    if (axios.isAxiosError(error)) {
      const serverIssues = error.response?.data?.issues

      if (serverIssues) {
        console.log("Validation issues from server:", serverIssues)
      } else {
        console.log("HTTP Status:", error.response?.status)
        console.log("Message:", error.message)
      }
    } else {
      console.log("Unexpected non-Axios error:", error)
    }

    return error as Error
  }
}
