import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { GridCol, GridRow, Link } from "govuk-react"
import Accordion from "../Accordion"
import Badge, { BadgeColours } from "../Badge"
import { ExceptionRow } from "./Exception.styles"
import { InsetText, InsetTextHeading } from "./PncException.styles"

type Props = {
  code: ExceptionCode
  message?: string
}

const pncExceptionDescriptions: Record<string, Record<string, string>> = {
  [ExceptionCode.HO100402]: {
    "I1008 - GWAY - ENQUIRY ERROR INVALID ADJUDICATION": "Check the offence matching",
    "I1008 - GWAY - ENQUIRY ERROR MORE THAN 3 DISPOSAL GROUPS": "Enquiry error more than 3 disposal groups",
    "I1008 - GWAY - ENQUIRY ERROR NO SUITABLE DISPOSAL GROUPS":
      "Create DH page on PNC, then Submit the case on Bichard 7",
    "I1008 - GWAY - ENQUIRY ERROR RECORD CORRUPTION: INCORRECT CHARGE COUNT ON COURT CASE":
      "Check PNC record and re-submit",
    "I1008 - GWAY - ENQUIRY ERROR TOO MANY DISPOSALS": "Check PNC record and re-submit",
    "I1036 - Error encountered processing enquiry": "Re-submit case to the PNC"
  },
  [ExceptionCode.HO100404]: {
    "Unexpected PNC communication error": "Re-submit case to the PNC"
  }
}

const getPncExceptionDescription = (code: ExceptionCode, message?: string) => {
  const descriptions = pncExceptionDescriptions[code]

  if (descriptions) {
    return Object.entries(descriptions).find(([descriptionKey]) => message?.includes(descriptionKey))?.[1]
  }

  return message
}

const PncException = ({ code, message }: Props) => {
  const isPncQueryExceptionCode = [ExceptionCode.HO100302, ExceptionCode.HO100314].includes(code)
  const description = getPncExceptionDescription(code, message)

  return (
    <ExceptionRow className={`moj-exception-row`}>
      <GridRow className="exception-row exception-row__header">
        <GridCol>
          <Badge isRendered={true} colour={BadgeColours.Red} label={"PNC Error"} className="moj-badge--large" />
        </GridCol>
      </GridRow>

      <GridRow className="exception-row exception-row__details">
        <GridCol>
          {code}
          {` - PNC ${isPncQueryExceptionCode ? "Query" : "Update"} Error`}
        </GridCol>
      </GridRow>

      <GridRow className="exception-row exception-row__help">
        <GridCol>
          {description && (
            <Accordion id={`exception-${code.toLocaleLowerCase()}`} heading="PNC error message">
              <InsetText className="b7-inset-text">
                <InsetTextHeading className="b7-inset-text__heading">{"PNC error message"}</InsetTextHeading>
                <span className="b7-inset-text__content">{description}</span>
              </InsetText>
            </Accordion>
          )}
          <Link href={`/help/bichard-functionality/exceptions/resolution.html#${code}`} target="_blank">
            {"More information"}
          </Link>
        </GridCol>
      </GridRow>
    </ExceptionRow>
  )
}

export default PncException
