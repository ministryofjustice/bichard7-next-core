import type AddLine from "../types/AddLine"
import type EventDetails from "../types/EventDetails"
import { getCourtDetailsByLjaCode } from "../utils/courtDetails"
import getOffenceCodeDetails from "../utils/getOffenceCodeDetails"
import getResultCodeDetails from "../utils/getResultCodeDetails"

const generateLinesForSubsequentDisposalResult = async (
  event: EventDetails,
  type: "Subsequently Varied" | "Sentence Deferred",
  addLine: AddLine
): Promise<void> => {
  const actualEvent = type === "Subsequently Varied" ? event.subsequentlyVaried! : event.sentenceDeferred!
  const request = actualEvent.request
  addLine("==================================================================")
  addLine(`${actualEvent.errors.length > 0 ? "❌" : "✅"} Bichard Update: ${type}\t${actualEvent.timestamp}`)
  addLine("==================================================================")
  addLine("The request below failed to update with the following error message(s):", actualEvent.errors.length > 0)
  addLine(`\t${actualEvent.errors.join("\n\t")}`, actualEvent.errors.length > 0)
  addLine("------------------------------------------------------------------\n", actualEvent.errors.length > 0)
  addLine(`Court case reference: ${request.courtCaseReference}`, true, true)
  addLine(`Person URN: ${request.longPersonUrn}`, true, true)
  addLine(`Force owner: ${request.ownerCode}`)
  addLine(`Appearance date: ${request.appearanceDate}`)
  if (request.court?.courtIdentityType === "code") {
    addLine(`Court: ${await getCourtDetailsByLjaCode(request.court.courtCode)}`)
  } else {
    addLine(`Court: ${request.court?.courtName}`)
  }

  addLine("\n--- Offences ---\n", (request.offences ?? []).length > 0)
  let offenceIndex = 1
  for (const offence of request.offences ?? []) {
    addLine("----------------------", offenceIndex > 1)
    addLine(`Offence #${offenceIndex++}`)
    addLine(`\tCourt offence sequence number: ${offence.courtOffenceSequenceNumber}`)
    addLine(`\tCode: ${await getOffenceCodeDetails(offence.cjsOffenceCode)}`)
    const offenceStartTime = offence.offenceStartTime ? ` ${offence.offenceStartTime}` : ""
    addLine(`\tStart date and time: ${offence.offenceStartDate}${offenceStartTime}`, !!offence.offenceStartDate)
    const offenceEndTime = offence.offenceEndTime ? ` ${offence.offenceEndTime}` : ""
    addLine(`\tEnd date and time: ${offence.offenceEndDate}${offenceEndTime}`, !!offence.offenceEndDate)
    addLine(
      `\tRole qualifiers: ${offence.roleQualifiers?.join(", ")}`,
      !!offence.roleQualifiers && offence.roleQualifiers.length > 0
    )
    addLine(`\tPlea: ${offence.plea}`, !!offence.plea)
    addLine(`\tAdjudication: ${offence.adjudication}`, !!offence.adjudication)

    addLine("\n\t\t---Disposal results---\n", offence.disposalResults && offence.disposalResults.length > 0)

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

export default generateLinesForSubsequentDisposalResult
