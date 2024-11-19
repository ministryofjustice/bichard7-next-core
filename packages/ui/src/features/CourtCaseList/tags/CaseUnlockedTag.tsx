import Badge, { BadgeColours } from "components/Badge"
import ConditionalRender from "components/ConditionalRender"

const CaseUnlockedTag: React.FC<{ isCaseUnlocked: boolean }> = (props: { isCaseUnlocked: boolean }) => {
  return (
    <ConditionalRender isRendered={props.isCaseUnlocked}>
      <Badge className="moj-badge--large" colour={BadgeColours.Green} isRendered={true} label={"Case unlocked"} />
    </ConditionalRender>
  )
}

export default CaseUnlockedTag
