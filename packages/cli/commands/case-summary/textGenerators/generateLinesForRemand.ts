import type AddLine from "../types/AddLine"
import type EventDetails from "../types/EventDetails"
import { getCourtDetailsByLjaCode } from "../utils/courtDetails"

const generateLinesForRemand = async (event: EventDetails, addLine: AddLine): Promise<void> => {
  const request = event.remand!.request
  addLine("==================================================================")
  addLine(`${event.remand!.errors.length > 0 ? "❌" : "✅"} Bichard Update: Add remand\t${event.remand!.timestamp}`)
  addLine("==================================================================")
  addLine("The request below failed to update with the following error message(s):", event.remand!.errors.length > 0)
  addLine(`\t${event.remand!.errors.join("\n\t")}`, event.remand!.errors.length > 0)
  addLine("------------------------------------------------------------------\n", event.remand!.errors.length > 0)
  addLine(`Person URN: ${request.longPersonUrn}`, true, true)
  addLine(`Force owner: ${request.ownerCode}`)
  addLine(`Remand date: ${request.remandDate}`)
  addLine(`Appearance result: ${request.appearanceResult}`)
  addLine("Current appearance:")
  if (request.currentAppearance.court?.courtIdentityType === "code") {
    addLine(`\tCourt: ${await getCourtDetailsByLjaCode(request.currentAppearance.court.courtCode)}`)
  } else {
    addLine(`\tCourt: ${request.currentAppearance.court?.courtName}`, !!request.currentAppearance.court)
  }

  addLine(`\tForce: ${request.currentAppearance.forceStationCode}`, !!request.currentAppearance.forceStationCode)

  addLine("Next appearance:", !!request.nextAppearance)
  addLine(`\tDate: ${request.nextAppearance?.date}`, !!request.nextAppearance?.date)
  if (request.nextAppearance?.court?.courtIdentityType === "code") {
    addLine(`\tCourt: ${await getCourtDetailsByLjaCode(request.nextAppearance.court.courtCode)}`)
  } else {
    addLine(`\tCourt: ${request.nextAppearance?.court?.courtName}`, !!request.nextAppearance?.court)
  }

  const hasBailConditions = request.bailConditions && request.bailConditions.length > 0
  addLine("Bail Conditions:", hasBailConditions)
  request.bailConditions?.forEach((conditionText, conditionIndex) => {
    addLine(
      `\t--- Condition ${conditionIndex + 1} ---\n\t${conditionText.replace(/\n/g, "\n\t")}`,
      !!conditionText,
      true,
      true
    )
  })
}

export default generateLinesForRemand
