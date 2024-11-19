import { StyledA } from "./FilterTag.styles"

interface Props {
  href: string
  tag: string
}

const FilterTag: React.FC<Props> = ({ href, tag }: Props) => {
  const tagId = `filter-tag-${tag.replace(" ", "-").toLowerCase()}`

  return (
    <StyledA className={`moj-filter__tag dark-grey-filter-tag`} href={href} id={tagId}>
      <span className="govuk-visually-hidden">{`Remove ${tag} filter`}</span>
      {tag}
    </StyledA>
  )
}

export default FilterTag
