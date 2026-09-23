import type { S3Client } from "@aws-sdk/client-s3"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import {
  lookupModeOfTrialReasonBySpiCode,
  lookupPleaStatusBySpiCode,
  lookupVerdictBySpiCode
} from "@moj-bichard7/common/aho/dataLookup/dataLookup"
import {
  extractIncomingMessage,
  getResultedCaseMessage
} from "@moj-bichard7/common/aho/parse/transformSpiToAho/extractIncomingMessageData"
import type { fullResultedCaseMessageParsedXmlSchema } from "@moj-bichard7/common/schemas/spiResult"
import type z from "zod"
import type AddLine from "../types/AddLine"
import { getCourtDetailsByLjaCode, getCourtDetailsByOrganisationUnit } from "../utils/courtDetails"
import getGenderDetails from "../utils/getGenderDetails"
import getOffenceCodeDetails from "../utils/getOffenceCodeDetails"
import getRemandStatusBySpiCode from "../utils/getRemandStatusBySpiCode"
import getResultCodeDetails from "../utils/getResultCodeDetails"

type ResultedCaseMessage = z.infer<typeof fullResultedCaseMessageParsedXmlSchema>

const generateLinesForSpi = async (
  s3Client: S3Client,
  s3Path: string,
  receivedDate: string,
  addLine: AddLine
): Promise<void> => {
  const command = new GetObjectCommand({
    Bucket: "bichard-7-production-conductor-internal-incoming-messages",
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

  addLine("==================================================================")
  addLine(`SPI OUT: Court hearing outcome\t${receivedDate}`)
  addLine("==================================================================")
  const corporateDefendant = spi.ResultedCaseMessage.Session.Case.Defendant.CourtCorporateDefendant
  if (corporateDefendant) {
    addLine(`Organisation name: ${corporateDefendant.OrganisationName.OrganisationName}`, true, true)
    addLine(`Bail status: ${corporateDefendant.BailStatus}`, !!corporateDefendant.BailStatus)
    addLine(`Present at hearing: ${corporateDefendant.PresentAtHearing}`, !!corporateDefendant.PresentAtHearing)
  }

  const individualDefendant = spi.ResultedCaseMessage.Session.Case.Defendant.CourtIndividualDefendant
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
    addLine("Defendant details:", true, true)
    addLine(`\tName: ${personNameString}`, !!personNameString, true)
    addLine(
      `\tGender: ${await getGenderDetails(individualDefendant.PersonDefendant.BasePersonDetails.Gender)}`,
      !!individualDefendant.PersonDefendant.BasePersonDetails.Gender,
      true
    )
    addLine(
      `\tDate of birth: ${individualDefendant.PersonDefendant.BasePersonDetails.Birthdate}`,
      !!individualDefendant.PersonDefendant.BasePersonDetails.Birthdate,
      true
    )
    addLine(`Present at hearing: ${individualDefendant.PresentAtHearing}`, !!individualDefendant.PresentAtHearing)
    if (individualDefendant.PersonDefendant.BailConditions) {
      addLine("Bail conditions:")
      addLine(`\t${individualDefendant.PersonDefendant.BailConditions}`, true, true, true)
    }

    addLine("Bail details:", !!individualDefendant.BailStatus || !!individualDefendant.ReasonForBailConditionsOrCustody)
    addLine(
      `\tBail status: ${await getRemandStatusBySpiCode(individualDefendant.BailStatus)}`,
      !!individualDefendant.BailStatus
    )
    addLine(
      `\tReason for bail conditions or custody: ${individualDefendant.ReasonForBailConditionsOrCustody}`,
      !!individualDefendant.ReasonForBailConditionsOrCustody
    )
  }

  const courtHearing = spi.ResultedCaseMessage.Session.CourtHearing
  addLine("Hearing details:")
  addLine(`\tDate and time: ${courtHearing.Hearing.DateOfHearing} ${courtHearing.Hearing.TimeOfHearing}`)
  addLine(`\tLocation: ${await getCourtDetailsByOrganisationUnit(courtHearing.Hearing.CourtHearingLocation)}`)
  addLine(`\tPSA code: ${await getCourtDetailsByLjaCode(courtHearing.PSAcode)}`)

  const defendant = spi.ResultedCaseMessage.Session.Case.Defendant
  const offences = defendant.Offence ? (Array.isArray(defendant.Offence) ? defendant.Offence : [defendant.Offence]) : []
  addLine("\n--- Offences ---\n", offences.length > 0)
  let offenceIndex = 1
  for (const offence of offences) {
    addLine("----------------------", offenceIndex > 1)
    addLine(`Offence #${offenceIndex++}`)
    addLine(`\tCourt offence sequence number: ${offence.BaseOffenceDetails.OffenceSequenceNumber}`)
    addLine(`\tCode: ${await getOffenceCodeDetails(offence.BaseOffenceDetails.OffenceCode)}`)
    addLine(`\tTitle: ${offence.BaseOffenceDetails.OffenceTitle}`, !!offence.BaseOffenceDetails.OffenceTitle, true)
    const offenceStart = offence.BaseOffenceDetails.OffenceTiming.OffenceStart
    if (offenceStart) {
      const offenceStartTime = offenceStart.OffenceStartTime ? ` ${offenceStart.OffenceStartTime}` : ""
      addLine(`\tStart date and time: ${offenceStart.OffenceDateStartDate}${offenceStartTime}`)
    }

    const offenceEnd = offence.BaseOffenceDetails.OffenceTiming.OffenceEnd
    if (offenceEnd) {
      const offenceEndTime = offenceEnd.OffenceEndTime ? ` ${offenceEnd.OffenceEndTime}` : ""
      addLine(`\tEnd date and time: ${offenceEnd.OffenceEndDate}${offenceEndTime}`)
    }

    addLine(`\tArrest date: ${offence.BaseOffenceDetails.ArrestDate}`, !!offence.BaseOffenceDetails.ArrestDate)
    addLine(`\tCharge date: ${offence.BaseOffenceDetails.ChargeDate}`, !!offence.BaseOffenceDetails.ChargeDate)
    addLine(`\tConviction date: ${offence.ConvictionDate}`, !!offence.ConvictionDate)
    addLine(`\tConvicting court: ${await getCourtDetailsByLjaCode(offence.ConvictingCourt)}`, !!offence.ConvictingCourt)
    addLine(
      `\tFinding (Verdict): ${lookupVerdictBySpiCode(offence.Finding ?? "")?.description} (${offence.Finding})`,
      !!offence.Finding
    )
    addLine(`\tPlea: ${lookupPleaStatusBySpiCode(offence.Plea)?.description} (${offence.Plea})`, !!offence.Plea)
    addLine(
      `\tMode of trial: ${lookupModeOfTrialReasonBySpiCode(offence.ModeOfTrial ?? "")?.description} (${offence.ModeOfTrial})`,
      !!offence.ModeOfTrial
    )

    const results = offence.Result ? (Array.isArray(offence.Result) ? offence.Result : [offence.Result]) : []
    addLine("\n\t\t--- Resutls ---\n", results.length > 0)

    let resultIndex = 1
    for (const result of results) {
      addLine(`\t\tResult #${resultIndex++}`)
      addLine(`\t\t\tResult code: ${await getResultCodeDetails(result.ResultCode)}`)
      addLine("\t\t\tResult text:", !!result.ResultText, true)
      addLine(`\t\t\t\t${result.ResultText.replace("\n", "\n\t\t\t\t")}`, !!result.ResultText, true)
      if (result.Outcome?.Duration) {
        addLine("\t\t\tOutcome → Duration:")
        const duration = result.Outcome?.Duration
        const durationStartDate = duration.DurationStartDate
          ? Array.isArray(duration.DurationStartDate)
            ? duration.DurationStartDate
            : [duration.DurationStartDate]
          : []
        addLine(`\t\t\t\tStart date: ${durationStartDate.join(", ")}`, durationStartDate.length > 0)

        const durationEndDate = duration.DurationEndDate
          ? Array.isArray(duration.DurationEndDate)
            ? duration.DurationEndDate
            : [duration.DurationEndDate]
          : []
        addLine(`\t\t\t\tEnd date: ${durationEndDate.join(", ")}`, durationEndDate.length > 0)
        addLine(
          `\t\t\t\tValue: ${duration.DurationValue} ${duration.DurationUnit}`,
          duration.DurationValue !== undefined
        )
        addLine(
          `\t\t\t\tSecondary value: ${duration.SecondaryDurationValue} ${duration.SecondaryDurationUnit}`,
          duration.SecondaryDurationValue !== undefined
        )
      }

      addLine(`\t\t\tOutcome → Penalty points: ${result.Outcome?.PenaltyPoints}`, !!result.Outcome?.PenaltyPoints)
      addLine(
        `\t\t\tOutcome → Amount Sterling: ${result.Outcome?.ResultAmountSterling}`,
        !!result.Outcome?.ResultAmountSterling
      )

      const resultCodeQualifiers = result.ResultCodeQualifier
        ? Array.isArray(result.ResultCodeQualifier)
          ? result.ResultCodeQualifier
          : [result.ResultCodeQualifier]
        : []
      addLine(`\t\t\tQualifiers: ${resultCodeQualifiers.join(", ")}`, resultCodeQualifiers.length > 0)

      addLine("\t\t\tNext hearing:", !!result.NextHearing)
      addLine(
        `\t\t\t\tBail status for offence: ${await getRemandStatusBySpiCode(result.NextHearing?.BailStatusOffence)}`,
        !!result.NextHearing?.BailStatusOffence
      )

      const nextHearingTime = result.NextHearing?.NextHearingDetails.TimeOfHearing
        ? ` ${result.NextHearing.NextHearingDetails.TimeOfHearing}`
        : ""
      addLine(
        `\t\t\t\tNext hearing: ${result.NextHearing?.NextHearingDetails.DateOfHearing}${nextHearingTime}`,
        !!result.NextHearing?.NextHearingDetails
      )
    }
  }
}

export default generateLinesForSpi
