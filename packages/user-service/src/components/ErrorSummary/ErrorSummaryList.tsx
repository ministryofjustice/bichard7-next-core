import { ReactNode } from "react"

interface Props {
  items: { id?: string; error?: ReactNode | false }[]
}

const ErrorSummaryList = ({ items }: Props) => (
  <ul className="govuk-list govuk-error-summary__list">
    {items.map(
      (item, index) =>
        !!item.error && (
          <li key={String(index)}>
            {!!item.id && <a href={`#${item.id}`}>{item.error}</a>}
            {!item.id && item.error}
          </li>
        )
    )}
  </ul>
)

export default ErrorSummaryList
