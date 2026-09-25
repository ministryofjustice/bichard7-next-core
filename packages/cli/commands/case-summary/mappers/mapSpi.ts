import type { S3Client } from "@aws-sdk/client-s3"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { lookupModeOfTrialReasonBySpiCode, lookupPleaStatusBySpiCode, lookupVerdictBySpiCode } from "@moj-bichard7/common/aho/dataLookup/dataLookup"
import { extractIncomingMessage, getResultedCaseMessage } from "@moj-bichard7/common/aho/parse/transformSpiToAho/extractIncomingMessageData"
import type { fullResultedCaseMessageParsedXmlSchema } from "@moj-bichard7/common/schemas/spiResult"
import type { SpiOffence, SpiResult } from "@moj-bichard7/common/types/SpiResult"
import type z from "zod"
import type Metadata from "../types/Metadata"
import type SensitiveFn from "../types/SensitiveFn"
import { getCourtDetailsByLjaCode, getCourtDetailsByOrganisationUnit } from "../utils/courtDetails"
import getGenderDetails from "../utils/getGenderDetails"
import getOffenceCodeDetails from "../utils/getOffenceCodeDetails"
import getRemandStatusBySpiCode from "../utils/getRemandStatusBySpiCode"
import getResultCodeDetails from "../utils/getResultCodeDetails"

type ResultedCaseMessage = z.infer<typeof fullResultedCaseMessageParsedXmlSchema>

const workspace = process.env.WORKSPACE ?? "production"

const mapResult = async (result: SpiResult, resultIndex: number, sensitive: SensitiveFn) => {
  const outcome = result.Outcome
  const durationStartDate = outcome?.Duration?.DurationStartDate
    ? Array.isArray(outcome.Duration.DurationStartDate)
      ? outcome.Duration.DurationStartDate
      : [outcome.Duration.DurationStartDate]
    : []
  const durationEndDate = outcome?.Duration?.DurationEndDate
    ? Array.isArray(outcome.Duration.DurationEndDate)
      ? outcome.Duration.DurationEndDate
      : [outcome.Duration.DurationEndDate]
    : []
  const resultCodeQualifiers = result.ResultCodeQualifier
    ? Array.isArray(result.ResultCodeQualifier)
      ? result.ResultCodeQualifier
      : [result.ResultCodeQualifier]
    : []
  const nextHearingDetails = result.NextHearing?.NextHearingDetails

  return {
    Result: `#${resultIndex + 1}`,
    "Result code": await getResultCodeDetails(result.ResultCode),
    "Result text": sensitive(result.ResultText),
    Outcome: result.Outcome
      ? {
          Duration: outcome?.Duration
            ? {
                "Start date": durationStartDate,
                "End date": durationEndDate,
                Value: outcome.Duration.DurationValue ? `${outcome.Duration.DurationValue}${outcome.Duration.DurationUnit ?? ""}` : undefined,
                "Secondary value": outcome.Duration.SecondaryDurationValue
                  ? `${outcome.Duration.SecondaryDurationValue}${outcome.Duration.SecondaryDurationUnit ?? ""}`
                  : undefined
              }
            : undefined,
          "Penalty points": outcome?.PenaltyPoints,
          Amount: outcome?.ResultAmountSterling ? `£${outcome.ResultAmountSterling}` : undefined
        }
      : undefined,
    Qualifiers: resultCodeQualifiers,
    "Next hearing": result.NextHearing
      ? {
          "Bail status for offence": result.NextHearing.BailStatusOffence
            ? await getRemandStatusBySpiCode(result.NextHearing.BailStatusOffence)
            : undefined,
          "Next hearing date and time": nextHearingDetails
            ? `${nextHearingDetails.DateOfHearing}${nextHearingDetails.TimeOfHearing ? ` ${nextHearingDetails.TimeOfHearing}` : ""}`
            : undefined
        }
      : undefined
  }
}

const mapOffence = async (offence: SpiOffence, offenceIndex: number, sensitive: SensitiveFn) => {
  const results = offence.Result ? (Array.isArray(offence.Result) ? offence.Result : [offence.Result]) : []
  const offenceStart = offence.BaseOffenceDetails.OffenceTiming.OffenceStart
  const offenceEnd = offence.BaseOffenceDetails.OffenceTiming.OffenceEnd

  return {
    Offence: `#${offenceIndex + 1}`,
    "Court offence sequence number": offence.BaseOffenceDetails.OffenceSequenceNumber,
    Code: await getOffenceCodeDetails(offence.BaseOffenceDetails.OffenceCode),
    Title: sensitive(offence.BaseOffenceDetails.OffenceTitle),
    "Start date and time": `${offenceStart.OffenceDateStartDate}${offenceStart.OffenceStartTime ? ` ${offenceStart.OffenceStartTime}` : ""}`,
    "Emd date and time": offenceEnd ? `${offenceEnd.OffenceEndDate}${offenceEnd.OffenceEndTime ? ` ${offenceEnd.OffenceEndTime}` : ""}` : undefined,
    "Arrest date": offence.BaseOffenceDetails.ArrestDate,
    "Charge date": offence.BaseOffenceDetails.ChargeDate,
    "Conviction date": offence.ConvictionDate,
    "Convicting court": await getCourtDetailsByLjaCode(offence.ConvictingCourt),
    "Finding (Verdict)": offence.Finding ? lookupVerdictBySpiCode(offence.Finding ?? "")?.description : undefined,
    Plea: offence.Plea ? lookupPleaStatusBySpiCode(offence.Plea)?.description : undefined,
    "Mode of trial": offence.ModeOfTrial ? lookupModeOfTrialReasonBySpiCode(offence.ModeOfTrial ?? "")?.description : undefined,
    Results: await Promise.all(results.map((result, resultIndex) => mapResult(result, resultIndex, sensitive)))
  }
}

const mapSpi = async (s3Client: S3Client, s3Path: string, receivedDate: string, sensitive: SensitiveFn) => {
  const command = new GetObjectCommand({
    Bucket: `bichard-7-${workspace}-conductor-internal-incoming-messages`,
    Key: s3Path
  })

  const response = await s3Client.send(command)

  const xmlString = (await response.Body?.transformToString()) as string
  const incomingMessage = extractIncomingMessage(xmlString)
  if (incomingMessage instanceof Error) {
    console.error(incomingMessage)
    process.exit(1)
  }

  const spi = getResultedCaseMessage(incomingMessage) as ResultedCaseMessage

  const metadata: Metadata = {
    title: "SPI OUT: Court hearing outcome",
    timestamp: receivedDate,
    errors: []
  }

  const courtHearing = spi.ResultedCaseMessage.Session.CourtHearing
  const defendant = spi.ResultedCaseMessage.Session.Case.Defendant
  const individualDefendant = defendant.CourtIndividualDefendant
  const corporateDefendant = defendant.CourtCorporateDefendant

  const corporateDefendantJson = corporateDefendant
    ? {
        "Organisation name": sensitive(corporateDefendant.OrganisationName.OrganisationName),
        "Bail status": corporateDefendant.BailStatus,
        "Present at hearing": corporateDefendant.PresentAtHearing
      }
    : undefined

  let individualDefendantJson = undefined
  if (individualDefendant) {
    const personName = individualDefendant.PersonDefendant.BasePersonDetails.PersonName
    const personNameString = [
      personName?.PersonTitle,
      personName?.PersonGivenName1,
      personName?.PersonGivenName2,
      personName?.PersonGivenName3,
      personName?.PersonFamilyName
    ]
      .filter(Boolean)
      .join(" ")

    individualDefendantJson = {
      Name: sensitive(personNameString),
      Gender: sensitive(await getGenderDetails(individualDefendant.PersonDefendant.BasePersonDetails.Gender)),
      "Date of birth": sensitive(individualDefendant.PersonDefendant.BasePersonDetails.Birthdate),
      "Present at hearing": individualDefendant.PresentAtHearing,
      "Bail conditions": individualDefendant.PersonDefendant.BailConditions,
      "Bail status": await getRemandStatusBySpiCode(individualDefendant.BailStatus),
      "Reason for bail conditions or custody": individualDefendant.ReasonForBailConditionsOrCustody
    }
  }

  const offences = defendant.Offence ? (Array.isArray(defendant.Offence) ? defendant.Offence : [defendant.Offence]) : []

  return {
    metadata,
    ...(corporateDefendantJson ? { "Corporate defendant": corporateDefendantJson } : {}),
    ...(individualDefendantJson ? { "Individual defendant": individualDefendantJson } : {}),
    "Hearing details": {
      "Date and time": `${courtHearing.Hearing.DateOfHearing} ${courtHearing.Hearing.TimeOfHearing}`,
      Location: await getCourtDetailsByOrganisationUnit(courtHearing.Hearing.CourtHearingLocation),
      "PSA code": await getCourtDetailsByLjaCode(courtHearing.PSAcode)
    },
    Offences: await Promise.all(offences.map((offence, offenceIndex) => mapOffence(offence, offenceIndex, sensitive)))
  }
}

export default mapSpi
