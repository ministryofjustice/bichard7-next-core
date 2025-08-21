import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { Accordion } from "../Accordion"
import Badge, { BadgeColours } from "../Badge"
import { ExceptionRow } from "./Exception.styles"
import { InsetText, InsetTextHeading } from "./PncException.styles"

type Props = {
  code: ExceptionCode
  message?: string
}

const PncException = ({ code, message }: Props) => {
  const isPncQueryExceptionCode = [
    ExceptionCode.HO100302,
    ExceptionCode.HO100313,
    ExceptionCode.HO100314,
    ExceptionCode.HO100315
  ].includes(code)
  const isPncUpdateExceptionCode = [
    ExceptionCode.HO100401,
    ExceptionCode.HO100403,
    ExceptionCode.HO100402,
    ExceptionCode.HO100404
  ].includes(code)
  return (
    <ExceptionRow className={`moj-exception-row`}>
      <div className="govuk-grid-row exception-row exception-row__header">
        <div className="govuk-grid-column-full">
          <Badge isRendered={true} colour={BadgeColours.Red} label={"PNC Error"} className="moj-badge--large" />
        </div>
      </div>

      <div className="govuk-grid-row exception-row exception-row__details">
        <div className="govuk-grid-column-full">
          {code}
          {` - ${isPncQueryExceptionCode ? "PNC Query" : isPncUpdateExceptionCode ? "PNC Update" : "ASN Not Found on PNC"} Error`}
        </div>
      </div>

      <div className="govuk-grid-row exception-row exception-row__help">
        <div className="govuk-grid-column-full">
          {message && (
            <Accordion id={`exception-${code.toLocaleLowerCase()}`} heading="PNC error message">
              <InsetText className="b7-inset-text">
                <InsetTextHeading className="b7-inset-text__heading">{"PNC error message"}</InsetTextHeading>
                <span className="b7-inset-text__content">{message}</span>
              </InsetText>
            </Accordion>
          )}
          <a
            className="govuk-link"
            rel="noreferrer noopener"
            href={`/help/bichard-functionality/exceptions/resolution.html#${code}`}
            target="_blank"
          >
            {"More information"}
          </a>
        </div>
      </div>
    </ExceptionRow>
  )
}

export default PncException
