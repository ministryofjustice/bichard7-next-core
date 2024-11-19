import ConditionalRender from "components/ConditionalRender"

import { StyledBadge } from "./Badge.styles"

export enum BadgeColours {
  Blue = "blue",
  Green = "green",
  Grey = "grey",
  Purple = "purple",
  Red = "red"
}

interface BadgeProps {
  className?: string
  colour: BadgeColours
  isRendered: boolean
  label: string
}

const Badge = ({ className, colour, isRendered, label }: BadgeProps) => {
  return (
    <ConditionalRender isRendered={isRendered}>
      <StyledBadge className={`moj-badge moj-badge--${colour} ${className}`}>{label}</StyledBadge>
    </ConditionalRender>
  )
}

export default Badge
