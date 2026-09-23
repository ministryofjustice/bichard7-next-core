import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { ErrorResponse } from "@moj-bichard7/core/types/leds/ErrorResponse"
import type AddLine from "../types/AddLine"
import type EventDetails from "../types/EventDetails"
import { getCourtDetailsByLjaCode } from "../utils/courtDetails"
import getOffenceCodeDetails from "../utils/getOffenceCodeDetails"
import getResultCodeDetails from "../utils/getResultCodeDetails"

const generateLinesForQuery = async (event: EventDetails, addLine: AddLine): Promise<void> => {
  addLine("==================================================================")
  addLine(
    `${event.queryResponse!.errors.length > 0 ? "❌" : "✅"} Bichard Query: Existing PNC offences and results\t${event.queryResponse!.timestamp}`
  )
  addLine("==================================================================")
  if (event.queryResponse!.errors.length > 0) {
    addLine("")
    addLine(
      (event.queryResponse!.response as ErrorResponse).leds.errors.map((error) => error.message.trim()).join("\n")
    )
    return
  }

  const queryResponse = event.queryResponse!.response as AsnQueryResponse
  let courtCaseIndex = 1
  addLine("\n--- Court Cases ---\n", (queryResponse.disposals ?? []).length > 0)
  for (const disposal of queryResponse.disposals) {
    addLine("----------------------", courtCaseIndex > 1)
    addLine(`Court case #${courtCaseIndex++}`)
    addLine(`Conviction date: ${disposal.convictionDate}`, !!disposal.convictionDate)
    addLine(`Court case reference: ${disposal.courtCaseReference}`)
    addLine(`Court case ID: ${disposal.courtCaseId}`, !!disposal.courtCaseId && disposal.courtCaseId !== "-")
    addLine(`Other TIC: ${disposal.otherTicTotal}`, !!disposal.otherTicTotal)
    addLine(`User reference: ${disposal.userReference}`, !!disposal.userReference)
    if (disposal.court.courtIdentityType === "code") {
      addLine(`Court: ${getCourtDetailsByLjaCode(disposal.court.courtCode)}`)
    } else {
      addLine(`Court: ${disposal.court.courtName}`)
    }

    addLine("\n\t--- Offences ---\n", (disposal.offences ?? []).length > 0)
    let offenceIndex = 1
    for (const offence of disposal.offences) {
      addLine("\t----------------------", offenceIndex > 1)
      addLine(`\tOffence #${offenceIndex++}`)
      addLine(`\t\tCourt offence sequence number: ${offence.courtOffenceSequenceNumber}`)
      addLine(`\t\tCode: ${await getOffenceCodeDetails(offence.cjsOffenceCode)}`)
      addLine(`\t\tDescription: ${offence.offenceDescription}`, !!offence.offenceDescription, true)
      addLine(`\t\tNumber of offences taken into consideration (TIC): ${offence.offenceTic}`, !!offence.offenceTic)

      const offenceStartTime = offence.offenceStartTime ? ` ${offence.offenceStartTime}` : ""
      addLine(`\t\tStart date and time: ${offence.offenceStartDate}${offenceStartTime}`)
      if (offence.offenceEndDate) {
        const offenceEndTime = offence.offenceEndTime ? ` ${offence.offenceEndTime}` : ""
        addLine(`\t\tEnd date and time: ${offence.offenceEndDate}${offenceEndTime}`)
      }

      addLine(
        `\t\tRole qualifiers: ${offence.roleQualifiers}`,
        offence.roleQualifiers && offence.roleQualifiers.length > 0
      )
      addLine(`\t\tPlea: ${offence.plea}`, !!offence.plea)

      const adjudication = offence.adjudications?.sort((a, b) => (a.appearanceNumber < b.appearanceNumber ? 1 : -1))[0]
      addLine(`\t\tAdjudication: ${adjudication?.adjudication} (${adjudication?.disposalDate})`, !!adjudication)

      addLine("\n\t\t--- Disposal results ---\n", offence.disposalResults && offence.disposalResults.length > 0)

      let disposalIndex = 1
      for (const disposalResult of offence.disposalResults ?? []) {
        addLine(`\t\tDisposal Result #${disposalIndex++}`)
        addLine(`\t\t\tDisposal code: ${await getResultCodeDetails(disposalResult.disposalCode)}`)
        addLine("\t\t\tDisposal text:", !!disposalResult.disposalText, true)
        addLine(
          `\t\t\t\t${disposalResult.disposalText?.replace("\n", "\n\t\t\t\t")}`,
          !!disposalResult.disposalText,
          true
        )
        addLine(`\t\t\tEffective date: ${disposalResult.disposalEffectiveDate}`, !!disposalResult.disposalEffectiveDate)
        addLine(
          `\t\t\tFine: ${disposalResult.disposalFine?.amount} ${disposalResult.disposalFine?.units}`,
          !!disposalResult.disposalFine
        )
        addLine(
          `\t\t\tDuration: ${disposalResult.disposalDuration?.count} ${disposalResult.disposalDuration?.units}`,
          !!disposalResult.disposalDuration
        )
        addLine(
          `\t\t\tQualifiers: ${disposalResult.disposalQualifiers?.join(", ")}`,
          !!disposalResult.disposalQualifiers
        )
        addLine(
          `\t\t\tQualifier duration: ${disposalResult.disposalQualifierDuration?.count} ${disposalResult.disposalQualifierDuration?.units}`,
          !!disposalResult.disposalQualifierDuration
        )
      }
    }
  }
}

export default generateLinesForQuery
