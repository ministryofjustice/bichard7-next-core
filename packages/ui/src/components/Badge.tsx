import ConditionalRender from "components/ConditionalRender"
import { StyledBadge } from "./Badge.styles"

export enum BadgeColours {
  Red = "red",
  Blue = "blue",
  Purple = "purple",
  Grey = "grey",
  Green = "green"
}

interface BadgeProps {
  isRendered: boolean
  className?: string
  colour: BadgeColours
  label: string
}

const Badge = ({ isRendered, className, colour, label }: BadgeProps) => {
  return (
    <ConditionalRender isRendered={isRendered}>
      <StyledBadge className={`moj-badge moj-badge--${colour} ${className}`}>{label}</StyledBadge>
    </ConditionalRender>
  )
}

export default Badge
