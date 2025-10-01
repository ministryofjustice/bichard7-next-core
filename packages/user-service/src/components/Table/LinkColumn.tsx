import KeyValuePair from "types/KeyValuePair"
import Link from "../Link"

interface Props {
  field: string
  href: (item: KeyValuePair<string, string>) => string
  item?: KeyValuePair<string, string>
  "data-test"?: string
}

export const LinkColumn = ({ field, href, item, "data-test": dataTest }: Props) => {
  if (!item) {
    return <>{"Error while rendering LinkColumn component. Item must have value."}</>
  }

  return (
    <Link data-test={dataTest} className="govuk-link" href={href(item)}>
      {String(item[field])}
    </Link>
  )
}
