import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"

const pad = (item: string | number | undefined, length: number): string =>
  String(item ?? "")
    .slice(0, length)
    .padEnd(length, " ")

const formatCourtCaseReference = (courtCaseReference: string) =>
  courtCaseReference
    .split("/")
    .map((part, index) => (index === 2 ? part.replace(/^0+/, "") : part))
    .join("/")
const convertDate = (date: string) => date.split("-").reverse().join("")
const convertTime = (time: string) => time.slice(0, 5).replace(":", "")

const formatRow = (tag: string, fields: { val: string | undefined; len: number }[]): string => {
  const content = fields.map((f) => pad(f.val, f.len)).join("")

  return `<${tag}>${content}</${tag}>`
}

const convertLedsAsnQueryResponseJsonToXml = (ledsJson: AsnQueryResponse) => {
  const output: string[] = []

  output.push(formatRow("FSC", [{ val: ledsJson.ownerCode, len: 4 }]))

  output.push(
    formatRow("IDS", [
      { val: ledsJson.personUrn, len: 11 },
      { val: "", len: 12 }, // pncCheckName
      { val: "", len: 12 } // croNumber
    ])
  )

  for (const disposal of ledsJson.disposals) {
    output.push(
      formatRow("CCR", [
        { val: formatCourtCaseReference(disposal.courtCaseReference), len: 15 },
        { val: "", len: 15 } // crimeOffenceReferenceNumber
      ])
    )

    for (const offence of disposal.offences) {
      output.push(
        formatRow("COF", [
          { val: String(offence.courtOffenceSequenceNumber).padStart(3, "0"), len: 3 },
          { val: offence.roleQualifiers?.join(""), len: 2 },
          { val: offence.legislationQualifiers?.join(""), len: 2 },
          { val: "", len: 13 }, // acpoOffenceCode
          { val: offence.cjsOffenceCode, len: 8 },
          { val: convertDate(offence.offenceStartDate), len: 8 },
          { val: offence.offenceStartTime && convertTime(offence.offenceStartTime), len: 4 },
          { val: offence.offenceEndDate && convertDate(offence.offenceEndDate), len: 8 },
          { val: offence.offenceEndTime && convertTime(offence.offenceEndTime), len: 4 }
        ])
      )
    }
  }

  return `<?XML VERSION="1.0" STANDALONE="YES"?><CXE01><ASI>${output.join("")}</ASI></CXE01>`
}

export default convertLedsAsnQueryResponseJsonToXml
