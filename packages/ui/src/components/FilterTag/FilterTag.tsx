import { StyledA } from "./FilterTag.styles"

interface Props {
  tag: string
  href: string
}

const FilterTag: React.FC<Props> = ({ tag, href }: Props) => {
  const tagId = `filter-tag-${tag.replace(" ", "-").toLowerCase()}`

  return (
    <StyledA id={tagId} className={`moj-filter__tag dark-grey-filter-tag`} href={href}>
      <span className="govuk-visually-hidden">{`Remove ${tag} filter`}</span>
      {tag}
    </StyledA>
  )
}

export default FilterTag
