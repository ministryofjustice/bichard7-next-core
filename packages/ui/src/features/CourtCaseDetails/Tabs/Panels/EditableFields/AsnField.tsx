import getShortAsn from "@moj-bichard7/common/utils/getShortAsn"
import Phase from "@moj-bichard7/core/types/Phase"
import AutoSave from "components/EditableFields/AutoSave"
import EditableFieldRow from "components/EditableFields/EditableFieldRow"
import ErrorMessage from "components/EditableFields/ErrorMessage"
import { useCourtCase } from "context/CourtCaseContext"
import { ChangeEvent, ClipboardEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import Asn from "services/Asn"
import { disabledKeys, handleAsnForwardSlashes, type Selection } from "utils/exceptions/handleAsnForwardSlashes"
import isAsnFormatValid from "utils/exceptions/isAsnFormatValid"
import isAsnException from "utils/exceptions/isException/isAsnException"
import { isEditableAsnException } from "utils/exceptions/isException/isEditableAsnException"
import { AsnInput } from "./AsnField.styles"

export const AsnField = () => {
  const { courtCase, amendments, amend } = useCourtCase()
  const defendant = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const updatedAhoAsn =
    courtCase.updatedHearingOutcome?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant
      ?.ArrestSummonsNumber

  const hasExceptions =
    courtCase.canUserEditExceptions &&
    courtCase.phase === Phase.HEARING_OUTCOME &&
    isAsnException(courtCase.aho.Exceptions)

  const isAsnEditable =
    hasExceptions || (courtCase.canUserEditExceptions && isEditableAsnException(courtCase.aho.Exceptions))

  let amendedAsn = ""
  if (amendments.asn || amendments.asn === "") {
    amendedAsn = amendments.asn
  } else if (!hasExceptions && isAsnEditable) {
    amendedAsn = defendant.ArrestSummonsNumber
  }

  const [isValidAsn, setIsValidAsn] = useState<boolean>(isAsnFormatValid(amendedAsn))
  const [isSavedAsn, setIsSavedAsn] = useState<boolean>(false)
  const [asnChanged, setAsnChanged] = useState<boolean>(false)
  const [selection, setSelection] = useState<Selection>()
  const [key, setKey] = useState<string>("")
  const [history, setHistory] = useState<string[]>([amendedAsn])
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const asnInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    handleAsnForwardSlashes(selection, amendedAsn, key, asnInputRef)
  }, [selection, amendedAsn, key])

  const amendAsn = (asn: string, selectionStart: number | null, selectionEnd: number | null) => {
    const newAsn = asn.toUpperCase().replace(/\//g, "")

    if (history[currentIndex] !== newAsn) {
      const newHistory = history.slice(0, currentIndex + 1)
      newHistory.push(newAsn)
      setHistory(newHistory)
      setCurrentIndex(newHistory.length - 1)
    }

    amend("asn")(newAsn)
    setSelection({ start: selectionStart, end: selectionEnd })
    setAsnChanged(true)
    setIsSavedAsn(false)
    setIsValidAsn(isAsnFormatValid(asn.toUpperCase()))
  }

  const undoAsn = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1)
      amend("asn")(history[currentIndex - 1])
    }
  }

  const redoAsn = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1)
      amend("asn")(history[currentIndex + 1])
    }
  }

  const setSelectionAfterUndoRedo = () => {
    if (asnInputRef?.current?.value) {
      const length = asnInputRef.current.value.length + 1
      setSelection({ start: length, end: length })
    }
  }

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey || e.metaKey) && ((e.shiftKey && e.key === "z") || e.key === "y")) {
      e.preventDefault()
      redoAsn()
      setSelectionAfterUndoRedo()
      return
    } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault()
      undoAsn()
      setSelectionAfterUndoRedo()
      return
    }

    if (e.code === "Backspace" || disabledKeys.includes(e.code)) {
      setKey(e.code)
    } else {
      setKey("")
    }

    if (e.code === "Space") {
      e.preventDefault()
    }

    const { selectionStart, selectionEnd } = e.currentTarget
    setSelection({ start: selectionStart, end: selectionEnd })
  }

  const handleAsnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value: inputAsnValue, selectionStart, selectionEnd } = e.target
    amendAsn(inputAsnValue.replaceAll(/\s/g, ""), selectionStart, selectionEnd)
  }

  const handleOnPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const asnFromClipboard = e.clipboardData.getData("text").replaceAll(/\s/g, "")
    const asnFromClipboardWithSlashes = Asn.divideAsn(asnFromClipboard)
    amendAsn(asnFromClipboard, asnFromClipboardWithSlashes.length, asnFromClipboardWithSlashes.length)
  }

  const handleOnCopy = () => {
    const copiedAsn = document.getSelection()?.toString().replace(/\//g, "")
    navigator.clipboard.writeText(copiedAsn ?? "")
  }

  return (
    <EditableFieldRow
      className={"asn-row"}
      value={getShortAsn(defendant.ArrestSummonsNumber)}
      updatedValue={getShortAsn(updatedAhoAsn)}
      label="ASN"
      hasExceptions={hasExceptions}
      isEditable={isAsnEditable}
      inputLabel="Enter the ASN"
      hintText="ASN format: Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 1 to 11 digits and 1 check letter \n Example: 22/49AB/49/1234C"
      htmlFor={"asn"}
    >
      <div>
        <div>
          <AsnInput
            ref={asnInputRef}
            className={`asn-input govuk-input ${!isValidAsn ? "govuk-input--error" : ""}`}
            id={"asn"}
            name={"asn"}
            onChange={handleAsnChange}
            value={Asn.divideAsn(amendedAsn.toUpperCase())}
            onKeyDown={handleOnKeyDown}
            onPaste={handleOnPaste}
            onCopy={handleOnCopy}
            onCut={handleOnCopy}
          />
        </div>
        <AutoSave
          setChanged={setAsnChanged}
          setSaved={setIsSavedAsn}
          isValid={isValidAsn}
          amendmentFields={["asn"]}
          isChanged={asnChanged}
          isSaved={isSavedAsn}
        >
          {!isValidAsn && <ErrorMessage message="Enter ASN in the correct format" />}
        </AutoSave>
      </div>
    </EditableFieldRow>
  )
}
