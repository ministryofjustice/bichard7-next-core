import { useState } from "react"
import ActionLink from "../ActionLink"

const ExpandableCell = ({ content }: { content: React.ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const longTextCharCount = 100
  const longTextAbbreviationCharCount = 30

  const isLongText = typeof content === "string" && content.length > longTextCharCount

  if (!isLongText) {
    return <>{content}</>
  }

  return (
    <div data-testid="expandable-cell">
      <div data-testid="expandable-cell-text">
        {isExpanded ? content : `${content.slice(0, longTextAbbreviationCharCount)}...`}
      </div>
      <ActionLink onClick={() => setIsExpanded(!isExpanded)} id={isExpanded ? "show-more-action" : "show-less-action"}>
        {isExpanded ? "show less" : "show more"}
      </ActionLink>
    </div>
  )
}

export default ExpandableCell
