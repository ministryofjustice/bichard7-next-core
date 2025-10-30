import React from "react"

interface BulletListProps {
  heading?: string
  items: string[]
  listClassName?: string
  headingClassName?: string
}

const BulletList: React.FC<BulletListProps> = ({
  heading,
  items,
  listClassName = "govuk-list govuk-list--bullet",
  headingClassName = "govuk-body"
}) => {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <>
      {heading && <p className={headingClassName}>{heading}</p>}

      <ul className={listClassName}>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  )
}

export default BulletList
