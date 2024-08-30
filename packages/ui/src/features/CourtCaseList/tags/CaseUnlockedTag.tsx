import Badge, { BadgeColours } from "components/Badge"
import ConditionalRender from "components/ConditionalRender"

const CaseUnlockedTag: React.FC<{ isCaseUnlocked: boolean }> = (props: { isCaseUnlocked: boolean }) => {
  return (
    <ConditionalRender isRendered={props.isCaseUnlocked}>
      <Badge isRendered={true} colour={BadgeColours.Green} label={"Case unlocked"} className="moj-badge--large" />
    </ConditionalRender>
  )
}

export default CaseUnlockedTag
