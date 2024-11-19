import ConditionalRender from "components/ConditionalRender"
import { DisplayTrigger } from "types/display/Triggers"

import CaseUnlockedTag from "../tags/CaseUnlockedTag"
import LockedByTag from "../tags/LockedByTag/LockedByTag"

type TriggerWithCount = { count: number } & Partial<DisplayTrigger>

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
        <div className={"trigger-description"} key={`trigger_${triggerId}`}>
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
  canUnlockCase,
  triggersHaveBeenRecentlyUnlocked,
  triggersLockedByFullName,
  triggersLockedByUsername,
  unlockPath
}: {
  canUnlockCase: boolean
  triggersHaveBeenRecentlyUnlocked: boolean
  triggersLockedByFullName: null | string | undefined
  triggersLockedByUsername: null | string | undefined
  unlockPath: string
}) => {
  return (
    <>
      <LockedByTag lockedBy={triggersLockedByFullName} unlockPath={canUnlockCase ? unlockPath : undefined} />
      <CaseUnlockedTag isCaseUnlocked={triggersHaveBeenRecentlyUnlocked && !triggersLockedByUsername} />
    </>
  )
}
