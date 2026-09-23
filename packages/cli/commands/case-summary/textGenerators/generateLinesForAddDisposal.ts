import type AddLine from "../types/AddLine"
import type EventDetails from "../types/EventDetails"
import { getCourtDetailsByLjaCode } from "../utils/courtDetails"
import getOffenceCodeDetails from "../utils/getOffenceCodeDetails"
import getResultCodeDetails from "../utils/getResultCodeDetails"

const generateLinesForOffences = async (event: EventDetails, addLine: AddLine) => {
  const request = event.addDisposal!.request
  addLine("\n--- Existing Offences ---\n")

  let offenceIndex = 1
  for (const offence of request.offences ?? []) {
    addLine("----------------------", offenceIndex > 1)
    addLine(`Offence #${offenceIndex++}`)
    addLine(`\tCourt offence sequence number: ${offence.courtOffenceSequenceNumber}`)
    addLine(`\tCode: ${await getOffenceCodeDetails(offence.cjsOffenceCode)}`)
    addLine(`\tNumber of offences taken into consideration (TIC): ${offence.offenceTic}`, !!offence.offenceTic)
    if (offence.offenceStartDate) {
      const offenceStartTime = offence.offenceStartTime ? ` ${offence.offenceStartTime}` : ""
      addLine(`\tStart date and time: ${offence.offenceStartDate}${offenceStartTime}`)
    }

    if (offence.offenceEndDate) {
      const offenceEndTime = offence.offenceEndTime ? ` ${offence.offenceEndTime}` : ""
      addLine(`\tEnd date and time: ${offence.offenceEndDate}${offenceEndTime}`)
    }

    addLine(
      `\tRole qualifiers: ${offence.roleQualifiers?.join(", ")}`,
      !!offence.roleQualifiers && offence.roleQualifiers.length > 0
    )
    addLine(`\tPlea: ${offence.plea}`, !!offence.plea)
    addLine(`\tAdjudication: ${offence.adjudication}`, !!offence.adjudication)

    addLine("\n\t\t--- Disposal results ---\n", offence.disposalResults && offence.disposalResults.length > 0)

    let disposalIndex = 1
    for (const disposalResult of offence.disposalResults ?? []) {
      addLine(`\t\tDisposal #${disposalIndex++}`)
      addLine(`\t\t\tDisposal code: ${await getResultCodeDetails(disposalResult.disposalCode)}`)
      addLine("\t\t\tDisposal text:", !!disposalResult.disposalText, true)
      addLine(
        `\t\t\t\t${disposalResult.disposalText?.replace("\n", "\n\t\t\t\t")}`,
        !!disposalResult.disposalText,
        true
      )
      addLine(`\t\t\tEffective date: ${disposalResult.disposalEffectiveDate}`, !!disposalResult.disposalEffectiveDate)
      addLine(`\t\t\tFine: £${disposalResult.disposalFine?.amount}`, !!disposalResult.disposalFine)
      addLine(
        `\t\t\tDuration: ${disposalResult.disposalDuration?.count} ${disposalResult.disposalDuration?.units ?? ""}`,
        !!disposalResult.disposalDuration
      )
      addLine(`\t\t\tQualifiers: ${disposalResult.disposalQualifiers?.join(", ")}`, !!disposalResult.disposalQualifiers)
      addLine(
        `\t\t\tQualifier duration: ${disposalResult!.disposalQualifierDuration?.count} ${disposalResult!.disposalQualifierDuration?.units}`,
        !!disposalResult.disposalQualifierDuration
      )
    }
  }
}

const generateLinesForAdditionalOffences = async (event: EventDetails, addLine: AddLine) => {
  const request = event.addDisposal!.request
  const additionalOffences = request.additionalArrestOffences?.[0].additionalOffences ?? []
  addLine("\n--- Additional Offences ---\n", additionalOffences.length > 0)

  let offenceIndex = 1
  for (const offence of request.additionalArrestOffences?.[0].additionalOffences ?? []) {
    addLine("----------------------", offenceIndex > 1)
    addLine(`Offence #${offenceIndex++}`)
    addLine(`\tCourt offence sequence number: ${offence.courtOffenceSequenceNumber}`)
    if (offence.offenceCode.offenceCodeType === "cjs") {
      addLine(`\tCode: ${await getOffenceCodeDetails(offence.offenceCode.cjsOffenceCode)}`)
    }

    addLine(`\tDescription: ${offence.offenceDescription}`, !!offence.offenceDescription, true)
    addLine(`\tNumber of offences taken into consideration (TIC): ${offence.offenceTic}`, !!offence.offenceTic)
    if (offence.offenceStartDate) {
      const offenceStartTime = offence.offenceStartTime ? ` ${offence.offenceStartTime}` : ""
      addLine(`\tStart date and time: ${offence.offenceStartDate}${offenceStartTime}`)
    }

    if (offence.offenceEndDate) {
      const offenceEndTime = offence.offenceEndTime ? ` ${offence.offenceEndTime}` : ""
      addLine(`\tEnd date and time: ${offence.offenceEndDate}${offenceEndTime}`)
    }

    addLine(
      `\tRole qualifiers: ${offence.roleQualifiers?.join(", ")}`,
      !!offence.roleQualifiers && offence.roleQualifiers.length > 0
    )
    addLine(`\tPlea: ${offence.plea}`, !!offence.plea)
    addLine(`\tAdjudication: ${offence.adjudication}`, !!offence.adjudication)

    addLine("\n\t\t--- Disposal results ---\n", offence.disposalResults && offence.disposalResults.length > 0)

    let disposalIndex = 1
    for (const disposalResult of offence.disposalResults ?? []) {
      addLine(`\t\tDisposal #${disposalIndex++}`)
      addLine(`\t\t\tDisposal code: ${await getResultCodeDetails(disposalResult.disposalCode)}`)
      addLine("\t\t\tDisposal text:", !!disposalResult.disposalText, true)
      addLine(
        `\t\t\t\t${disposalResult.disposalText?.replace("\n", "\n\t\t\t\t")}`,
        !!disposalResult.disposalText,
        true
      )
      addLine(`\t\t\tEffective date: ${disposalResult.disposalEffectiveDate}`, !!disposalResult.disposalEffectiveDate)
      addLine(`\t\t\tFine: £${disposalResult.disposalFine?.amount}`, !!disposalResult.disposalFine)
      addLine(
        `\t\t\tDuration: ${disposalResult.disposalDuration?.count} ${disposalResult.disposalDuration?.units ?? ""}`,
        !!disposalResult.disposalDuration
      )
      addLine(`\t\t\tQualifiers: ${disposalResult.disposalQualifiers?.join(", ")}`, !!disposalResult.disposalQualifiers)
      addLine(
        `\t\t\tQualifier duration: ${disposalResult.disposalQualifierDuration?.count} ${disposalResult.disposalQualifierDuration?.units}`,
        !!disposalResult.disposalQualifierDuration
      )
    }
  }
}

const generateLinesForAddDisposal = async (event: EventDetails, addLine: AddLine): Promise<void> => {
  const request = event.addDisposal!.request
  addLine("==================================================================")
  addLine(
    `${event.addDisposal!.errors.length > 0 ? "❌" : "✅"} Bichard Update: Add disposal results\t${event.addDisposal!.timestamp}`
  )
  addLine("==================================================================")
  addLine(
    "The request below failed to update with the following error message(s):",
    event.addDisposal!.errors.length > 0
  )
  addLine(`\t${event.addDisposal!.errors.join("\n\t")}`, event.addDisposal!.errors.length > 0)
  addLine("------------------------------------------------------------------\n", event.addDisposal!.errors.length > 0)
  addLine(`Conviction date: ${request.dateOfConviction}`)
  addLine(`Court case reference: ${request.courtCaseReference}`, true, true)
  addLine(`Person URN: ${request.longPersonUrn}`, true, true)
  addLine(`Force owner: ${request.ownerCode}`)
  addLine("Carried forward? Yes", !!request.carryForward)
  addLine(`\tApperance date: ${request.carryForward?.appearanceDate}`, !!request.carryForward)
  if (request.carryForward?.court?.courtIdentityType === "code") {
    addLine(`\tCourt: ${await getCourtDetailsByLjaCode(request.carryForward.court.courtCode)}`)
  } else {
    addLine(`\tCourt: ${request.carryForward?.court?.courtName}`, !!request.carryForward?.court)
  }

  addLine("Referred to court case? Yes", !!request.referToCourtCase)
  addLine(`\tReferred to court case reference: ${request.referToCourtCase?.text}`, !!request.referToCourtCase, true)

  await generateLinesForOffences(event, addLine)
  await generateLinesForAdditionalOffences(event, addLine)
}

export default generateLinesForAddDisposal
