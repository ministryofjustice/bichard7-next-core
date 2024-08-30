/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ConditionalRender from "components/ConditionalRender"

interface Props {
  condition: boolean
  label: string
  children: JSX.Element | JSX.Element[]
}

const FilterChipContainer: React.FC<Props> = ({ condition, label, children }: Props) => {
  return (
    <ConditionalRender isRendered={condition}>
      <h3 className="govuk-heading-s govuk-!-margin-bottom-0">{label}</h3>
      <ul className="moj-filter-tags govuk-!-margin-bottom-0">{children}</ul>
    </ConditionalRender>
  )
}

export default FilterChipContainer
