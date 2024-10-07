import { RefObject } from "react"
import Asn from "services/Asn"

export type Selection = {
  start: number | null
  end: number | null
}

// Do **not** add Tab to this list. It will break accessibility!
export const disabledKeys = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "MetaLeft",
  "MetaRight",
  "ControlLeft",
  "ControlRight",
  "AltLeft",
  "AltRight",
  "ShiftLeft",
  "ShiftRight",
  "Delete"
]

export const handleDeletingFirstCharacter = (selectionStart: number, selectionEnd: number, key: string) =>
  selectionStart === 0 && selectionEnd === 0 && key === "Backspace"

export const handleForwardJumpingForwardSlash = (amendedAsn: string, selectionStart: number, key: string) =>
  Asn.divideAsn(amendedAsn).split("")[selectionStart] === "/" && key !== "Backspace" && !disabledKeys.includes(key)

export const handleBackwardJumpingForwardSlash = (amendedAsn: string, selectionStart: number, key: string) =>
  Asn.divideAsn(amendedAsn).split("")[selectionStart - 1] === "/" && key === "Backspace" && !disabledKeys.includes(key)

export const handleAsnForwardSlashes = (
  selection: Selection | undefined,
  amendedAsn: string,
  key: string,
  asnInputRef: RefObject<HTMLInputElement>
): boolean => {
  if (!selection) {
    return false
  }

  const { start: selectionStart, end: selectionEnd } = selection

  // Handles selecting all and press Backspace.
  if (selectionStart === null || selectionEnd === null) {
    return true
  }

  if (handleDeletingFirstCharacter(selectionStart, selectionEnd, key)) {
    asnInputRef?.current?.setSelectionRange(0, 0)
    return true
  }

  if (handleForwardJumpingForwardSlash(amendedAsn, selectionStart, key)) {
    asnInputRef?.current?.setSelectionRange(selectionStart + 1, selectionEnd + 1)
    return true
  }

  if (handleBackwardJumpingForwardSlash(amendedAsn, selectionStart, key)) {
    asnInputRef?.current?.setSelectionRange(selectionStart - 1, selectionEnd - 1)
    return true
  }

  // Tracks the position on Backspace
  if (key === "Backspace" && asnInputRef?.current?.selectionStart !== 1) {
    asnInputRef?.current?.setSelectionRange(selectionStart, selectionEnd)
    return true
  }

  // Tracks the movement of the cursor on change.
  asnInputRef?.current?.setSelectionRange(selectionStart, selectionEnd)

  return true
}

export default handleAsnForwardSlashes
