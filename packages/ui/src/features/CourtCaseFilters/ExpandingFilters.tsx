import ConditionalRender from "components/ConditionalRender"
import { useState } from "react"
import { Container, IconContainer, Legend, LegendContainer } from "./ExpandingFilters.styles"

const UpArrow: React.FC = () => (
  <svg width={18} height={10} viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.999926 9.28432L8.74976 1.56866L16.4996 9.28432" stroke="#0B0C0C" strokeWidth={2} />
  </svg>
)

const DownArrow: React.FC = () => (
  <svg width={18} height={11} viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.9994 1.26702L9.26685 9L1.49977 1.30171" stroke="#0B0C0C" strokeWidth={2} />
  </svg>
)

interface Props {
  filterName: string
  children: React.ReactNode
  classNames?: string
}

const ExpandingFilters: React.FC<Props> = ({ filterName, classNames, children }: Props) => {
  const [isVisible, setVisible] = useState(true)
  const id = filterName.toLowerCase().replace(/\s+/g, "-") + "-panel"

  return (
    <fieldset className="govuk-fieldset">
      <Container
        as={"button"}
        type={"button"}
        className={classNames}
        aria-label={`${filterName} filter options`}
        aria-expanded={isVisible}
        aria-controls={id}
        onClick={() => setVisible(!isVisible)}
      >
        <IconContainer>{isVisible ? <UpArrow /> : <DownArrow />}</IconContainer>
        <LegendContainer className={"legend-container"}>
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
            <Legend>{filterName}</Legend>
          </legend>
        </LegendContainer>
      </Container>
      <div id={id} aria-hidden={!isVisible}>
        <ConditionalRender isRendered={isVisible}>{children}</ConditionalRender>
      </div>
    </fieldset>
  )
}

export default ExpandingFilters
