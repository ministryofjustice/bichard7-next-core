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

const PncException = ({ code, message }: Props) => {
  const isPncQueryExceptionCode = [
    ExceptionCode.HO100301,
    ExceptionCode.HO100302,
    ExceptionCode.HO100314,
    ExceptionCode.HO100401,
    ExceptionCode.HO100403,
    ExceptionCode.HO100402,
    ExceptionCode.HO100404
  ].includes(code)
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
          {message && (
            <Accordion id={`exception-${code.toLocaleLowerCase()}`} heading="PNC error message">
              <InsetText className="b7-inset-text">
                <InsetTextHeading className="b7-inset-text__heading">{"PNC error message"}</InsetTextHeading>
                <span className="b7-inset-text__content">{message}</span>
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
