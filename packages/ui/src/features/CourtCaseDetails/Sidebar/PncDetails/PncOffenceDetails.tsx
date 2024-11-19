import { formatDisplayedDate } from "utils/date/formattedDate"

interface PncOffenceDetailsProps {
  adjudication?: {
    offenceTICNumber: number
    plea: string
    sentenceDate?: Date
    verdict: string
    weedFlag?: string
  }
  details: {
    acpoOffenceCode?: string
    cjsOffenceCode?: string
    endDate?: Date
    qualifier1?: string
    qualifier2?: string
    sequenceNumber?: number
    startDate?: Date
    title?: string
  }
}

const PncOffenceDetails = ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  adjudication: { offenceTICNumber, plea, sentenceDate, verdict } = {
    offenceTICNumber: 0,
    plea: "-",
    sentenceDate: undefined,
    verdict: "-"
  },
  details: { acpoOffenceCode, cjsOffenceCode, endDate, qualifier1, qualifier2, sequenceNumber, startDate, title }
}: PncOffenceDetailsProps) => {
  return (
    <>
      <div>
        <div className="heading">
          <span className="govuk-heading-m">{`${String(sequenceNumber).padStart(3, "0")} - ${cjsOffenceCode}`}</span>
          <span className="govuk-heading-m">
            {"ACPO"}
            <span className="acpo-code"> {acpoOffenceCode}</span>
          </span>
        </div>
        <div id={"offence-title"}>{title}</div>
      </div>
      <div className="details">
        <div id={"start-date"}>
          <b>{"Start Date"}</b>
          <div>{startDate ? formatDisplayedDate(startDate, "dd/MM/yyyy HH:mm") : "-"}</div>
        </div>
        <div id={"end-date"}>
          <b>{"End Date"}</b>
          <div>{endDate ? formatDisplayedDate(endDate, "dd/MM/yyyy HH:mm") : "-"}</div>
        </div>
        <div id={"qualifier-1"}>
          <b>{"Qualifier 1"}</b>
          <div>{qualifier1 || "-"}</div>
        </div>
        <div id={"qualifier-2"}>
          <b>{"Qualifier 2"}</b>
          <div>{qualifier2 || "-"}</div>
        </div>
      </div>
      <div className="adjudication details">
        <div id={"adjudication"}>
          <b>{"Adjudication"}</b>
          <div>{verdict}</div>
        </div>
        <div id={"plea"}>
          <b>{"Plea"}</b>
          <div>{plea}</div>
        </div>
        <div id={"date-of-sentence"}>
          <b>{"Date of Sentence"}</b>
          <div>{sentenceDate ? formatDisplayedDate(sentenceDate) : "-"}</div>
        </div>
        <div id={"tic-number"}>
          <b>{"TIC Number"}</b>
          <div>{offenceTICNumber || "-"}</div>
        </div>
      </div>
    </>
  )
}

export default PncOffenceDetails
