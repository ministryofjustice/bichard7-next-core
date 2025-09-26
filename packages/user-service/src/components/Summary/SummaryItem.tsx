interface Props {
  label: string
  value: string
  dataTest: string
}

const SummaryItem = ({ label, value, dataTest }: Props) => (
  <div className="govuk-summary-list__row">
    <dt data-test={`summary-item_${dataTest}_label`} className="govuk-summary-list__key">
      {label}
    </dt>
    <dd data-test={`summary-item_${dataTest}_value`} className="govuk-summary-list__value">
      {value}
    </dd>
  </div>
)

export default SummaryItem
