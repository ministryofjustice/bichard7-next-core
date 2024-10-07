import ConditionalRender from "components/ConditionalRender"
import { DisplayTrigger } from "types/display/Triggers"
import CaseUnlockedTag from "../tags/CaseUnlockedTag"
import LockedByTag from "../tags/LockedByTag/LockedByTag"

type TriggerWithCount = Partial<DisplayTrigger> & { count: number }

const triggersWithCounts = (triggers: DisplayTrigger[]) => {
  return Object.values(
    triggers.reduce(
      (counts, trigger) => {
        let current = counts[trigger.triggerCode]
        if (!current) {
          current = { ...trigger, count: 1 }
        } else {
          current.count += 1
        }

        counts[trigger.triggerCode] = current
        return counts
      },
      {} as { [key: string]: TriggerWithCount }
    )
  )
}

export const TriggersReasonCell = ({ triggers }: { triggers: DisplayTrigger[] }) => {
  return (
    <>
      {triggersWithCounts(triggers).map((trigger, triggerId) => (
        <div key={`trigger_${triggerId}`} className={"trigger-description"}>
          {trigger.description}
          <ConditionalRender isRendered={trigger.count > 1}>
            <b>{` (${trigger.count})`}</b>
          </ConditionalRender>
        </div>
      ))}
    </>
  )
}

export const TriggersLockTag = ({
  triggersLockedByUsername,
  triggersLockedByFullName,
  triggersHaveBeenRecentlyUnlocked,
  canUnlockCase,
  unlockPath
}: {
  triggersLockedByUsername: string | null | undefined
  triggersLockedByFullName: string | null | undefined
  triggersHaveBeenRecentlyUnlocked: boolean
  canUnlockCase: boolean
  unlockPath: string
}) => {
  return (
    <>
      <LockedByTag lockedBy={triggersLockedByFullName} unlockPath={canUnlockCase ? unlockPath : undefined} />
      <CaseUnlockedTag isCaseUnlocked={triggersHaveBeenRecentlyUnlocked && !triggersLockedByUsername} />
    </>
  )
}
