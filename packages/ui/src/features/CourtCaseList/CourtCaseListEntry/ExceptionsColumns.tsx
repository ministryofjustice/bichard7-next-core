import CaseUnlockedTag from "../tags/CaseUnlockedTag"
import LockedByTag from "../tags/LockedByTag/LockedByTag"
import { SingleException } from "./CaseDetailsRow/SingleException"

export const ExceptionsReasonCell = ({ exceptionCounts }: { exceptionCounts: Record<string, number> }) => {
  return (
    <>
      {Object.keys(exceptionCounts).map((exception, exceptionId) => {
        return <SingleException exception={exception} exceptionCounter={exceptionCounts[exception]} key={exceptionId} />
      })}
    </>
  )
}

export const ExceptionsLockTag = ({
  canUnlockCase,
  errorLockedByFullName,
  exceptionsHaveBeenRecentlyUnlocked,
  unlockPath
}: {
  canUnlockCase: boolean
  errorLockedByFullName: null | string | undefined
  errorLockedByUsername: null | string | undefined
  exceptionsHaveBeenRecentlyUnlocked: boolean
  unlockPath: string
}) => {
  return (
    <>
      <LockedByTag lockedBy={errorLockedByFullName} unlockPath={canUnlockCase ? unlockPath : undefined} />
      <CaseUnlockedTag isCaseUnlocked={exceptionsHaveBeenRecentlyUnlocked && !errorLockedByFullName} />
    </>
  )
}
