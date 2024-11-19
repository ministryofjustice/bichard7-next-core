/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ConditionalRender from "components/ConditionalRender"

interface Props {
  children: JSX.Element | JSX.Element[]
  condition: boolean
  label: string
}

const FilterChipContainer: React.FC<Props> = ({ children, condition, label }: Props) => {
  return (
    <ConditionalRender isRendered={condition}>
      <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{label}</h3>
      <ul className="moj-filter-tags govuk-!-margin-bottom-0">{children}</ul>
    </ConditionalRender>
  )
}

export default FilterChipContainer
