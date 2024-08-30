import { DisplayPartialCourtCase } from "types/display/CourtCases"

const triggersAreLockedByCurrentUser = (courtCase: DisplayPartialCourtCase, username: string) =>
  !!courtCase.triggerLockedByUsername && courtCase.triggerLockedByUsername === username

const exceptionsAreLockedByCurrentUser = (courtCase: DisplayPartialCourtCase, username: string) =>
  !!courtCase.errorLockedByUsername && courtCase.errorLockedByUsername === username

const isLockedByCurrentUser = (courtCase: DisplayPartialCourtCase, username: string) =>
  triggersAreLockedByCurrentUser(courtCase, username) || exceptionsAreLockedByCurrentUser(courtCase, username)

const exceptionsAreLockedByAnotherUser = (courtCase: DisplayPartialCourtCase, username: string) =>
  !!courtCase.errorLockedByUsername && courtCase.errorLockedByUsername !== username

const triggersAreLockedByAnotherUser = (courtCase: DisplayPartialCourtCase, username: string) =>
  !!courtCase.triggerLockedByUsername && courtCase.triggerLockedByUsername !== username

const isLockedByAnotherUser = (courtCase: DisplayPartialCourtCase, username: string) =>
  exceptionsAreLockedByAnotherUser(courtCase, username) || triggersAreLockedByAnotherUser(courtCase, username)

export {
  exceptionsAreLockedByAnotherUser,
  exceptionsAreLockedByCurrentUser,
  isLockedByAnotherUser,
  isLockedByCurrentUser,
  triggersAreLockedByAnotherUser,
  triggersAreLockedByCurrentUser
}
