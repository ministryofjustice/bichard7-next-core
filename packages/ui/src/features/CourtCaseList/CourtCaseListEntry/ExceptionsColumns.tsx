import CaseUnlockedTag from "../tags/CaseUnlockedTag"
import LockedByTag from "../tags/LockedByTag/LockedByTag"
import { SingleException } from "./CaseDetailsRow/SingleException"

export const ExceptionsReasonCell = ({ exceptionCounts }: { exceptionCounts: Record<string, number> }) => {
  return (
    <>
      {Object.keys(exceptionCounts).map((exception, exceptionId) => {
        return <SingleException key={exceptionId} exception={exception} exceptionCounter={exceptionCounts[exception]} />
      })}
    </>
  )
}

export const ExceptionsLockTag = ({
  errorLockedByFullName,
  canUnlockCase,
  unlockPath,
  exceptionsHaveBeenRecentlyUnlocked
}: {
  errorLockedByUsername: string | null | undefined
  errorLockedByFullName: string | null | undefined
  canUnlockCase: boolean
  unlockPath: string
  exceptionsHaveBeenRecentlyUnlocked: boolean
}) => {
  return (
    <>
      <LockedByTag lockedBy={errorLockedByFullName} unlockPath={canUnlockCase ? unlockPath : undefined} />
      <CaseUnlockedTag isCaseUnlocked={exceptionsHaveBeenRecentlyUnlocked && !errorLockedByFullName} />
    </>
  )
}
