import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type LedsAuthentication from "../../../../types/leds/LedsAuthentication"

import NiamAuthenticationOptions, {
  NiamAuthenticationParameters
} from "../../../../types/leds/NiamAuthenticationOptions"
import generateBearerToken from "./generateBearerToken"

export default class NiamLedsAuthentication implements LedsAuthentication {
  private static instance: NiamLedsAuthentication
  private token: string
  private tokenExpiryDate: Date

  private constructor(private readonly options: NiamAuthenticationOptions) {}

  static createInstance(): NiamLedsAuthentication {
    if (NiamLedsAuthentication.instance) {
      return NiamLedsAuthentication.instance
    }

    const authenticationUrl = process.env.LEDS_NIAM_AUTH_URL
    const privateKey = process.env.LEDS_NIAM_PRIVATE_KEY
    const certificate = process.env.LEDS_NIAM_CERTIFICATE
    const parameters = process.env.LEDS_NIAM_PARAMETERS
    if (!authenticationUrl) {
      throw Error("LEDS_NIAM_AUTH_URL environment variable is required.")
    }

    if (!privateKey) {
      throw Error("LEDS_NIAM_PRIVATE_KEY environment variable is required.")
    }

    if (!certificate) {
      throw Error("LEDS_NIAM_CERTIFICATE environment variable is required.")
    }

    if (!parameters) {
      throw Error("LEDS_NIAM_PARAMETERS environment variable is required.")
    }

    let parsedParameters: NiamAuthenticationParameters
    try {
      parsedParameters = JSON.parse(parameters)
    } catch {
      throw Error("Failed to parse LEDS_NIAM_PARAMETERS environment variable.")
    }

    NiamLedsAuthentication.instance = new NiamLedsAuthentication({
      authenticationUrl,
      privateKey,
      certificate,
      parameters: parsedParameters
    })

    return NiamLedsAuthentication.instance
  }

  async generateBearerToken(): PromiseResult<string> {
    if (this.isTokenValid()) {
      return this.token
    }

    const tokenResult = await generateBearerToken(this.options)
    if (isError(tokenResult)) {
      return tokenResult
    }

    this.tokenExpiryDate = tokenResult.expiryDate
    this.token = tokenResult.token

    return this.token
  }

  private isTokenValid(): boolean {
    if (!this.token || !this.tokenExpiryDate) {
      return false
    }

    const now = new Date()
    const timeRemaining = this.tokenExpiryDate.getTime() - now.getTime()
    const thresholdMs = 5 * 60 * 1000 // 5 minutes

    return timeRemaining > thresholdMs
  }
}
