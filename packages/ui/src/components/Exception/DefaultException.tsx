import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import ErrorMessages from "types/ErrorMessages"
import NavigationHandler from "../../types/NavigationHandler"
import getExceptionDefinition from "../../utils/exceptionDefinition/getExceptionDefinition"
import getExceptionPathDetails from "../../utils/getExceptionPathDetails"
import ActionLink from "../ActionLink"
import { ExceptionRow, ExceptionRowHelp } from "./Exception.styles"

type Props = {
  onNavigate: NavigationHandler
  path: (string | number)[]
  code: ExceptionCode
}

const DefaultException = ({ path, code, onNavigate }: Props) => {
  const { tab, offenceOrderIndex, formattedFieldName, location } = getExceptionPathDetails(path)
  const exceptionDefinition =
    getExceptionDefinition(code)?.shortDescription || ErrorMessages[code as keyof typeof ErrorMessages]

  const handleClick = () => {
    switch (tab) {
      case "Offences":
        onNavigate({ location: "Case Details > Offences", args: { offenceOrderIndex } })
        break
      case "Case":
        onNavigate({ location: "Case Details > Case" })
        break
    }
  }

  return (
    <ExceptionRow className={`moj-exception-row`}>
      <div className="govuk-grid-row exception-header">
        <div className="govuk-grid-column-full">
          <b>
            {formattedFieldName}
            {" / "}
          </b>
          <ActionLink onClick={handleClick} className="exception-location">
            {location}
          </ActionLink>
        </div>
      </div>

      <div className="govuk-grid-row exception-details">
        <div className="govuk-grid-column-full">
          {code}
          {exceptionDefinition ? ` - ${exceptionDefinition}` : ""}
        </div>
      </div>

      <ExceptionRowHelp className={`govuk-grid-row exception-help`}>
        <div className="govuk-grid-column-full">
          <a
            className="govuk-link"
            rel="noreferrer noopener"
            href={`/help/bichard-functionality/exceptions/resolution.html#${code}`}
            target="_blank"
          >
            {"More information"}
          </a>
        </div>
      </ExceptionRowHelp>
    </ExceptionRow>
  )
}

export default DefaultException
