import Link from "./Link"

interface Props {
  href: string
}

const BackLink = ({ href }: Props) => (
  <Link href={href} className="govuk-back-link" data-test="back-link">
    {"Back"}
  </Link>
)

export default BackLink
