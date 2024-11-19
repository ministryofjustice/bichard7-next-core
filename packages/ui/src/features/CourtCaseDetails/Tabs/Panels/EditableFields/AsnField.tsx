import Phase from "@moj-bichard7/core/types/Phase"
import AutoSave from "components/EditableFields/AutoSave"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import ErrorMessage from "components/EditableFields/ErrorMessage"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { ChangeEvent, ClipboardEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import Asn from "services/Asn"
import { disabledKeys, handleAsnForwardSlashes, type Selection } from "utils/exceptions/handleAsnForwardSlashes"
import isAsnFormatValid from "utils/exceptions/isAsnFormatValid"
import isAsnException from "utils/exceptions/isException/isAsnException"

import { AsnInput } from "./AsnField.styles"

export const AsnField = () => {
  const { amend, amendments, courtCase } = useCourtCase()
  const currentUser = useCurrentUser()
  const defendant = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const amendedAsn = amendments.asn ?? ""
  const updatedAhoAsn =
    courtCase.updatedHearingOutcome?.AnnotatedHearingOutcome?.HearingOutcome?.Case?.HearingDefendant
      ?.ArrestSummonsNumber

  const [isValidAsn, setIsValidAsn] = useState<boolean>(isAsnFormatValid(amendedAsn))
  const [isSavedAsn, setIsSavedAsn] = useState<boolean>(false)
  const [asnChanged, setAsnChanged] = useState<boolean>(false)
  const [selection, setSelection] = useState<Selection>()
  const [key, setKey] = useState<string>("")

  const asnInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    handleAsnForwardSlashes(selection, amendedAsn, key, asnInputRef)
  }, [selection, amendedAsn, key])

  const amendAsn = (asn: string, selectionStart: null | number, selectionEnd: null | number) => {
    amend("asn")(asn.toUpperCase().replace(/\//g, ""))

    setSelection({ end: selectionEnd, start: selectionStart })
    setAsnChanged(true)
    setIsSavedAsn(false)
    setIsValidAsn(isAsnFormatValid(asn.toUpperCase()))
  }

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Backspace" || disabledKeys.includes(e.code)) {
      setKey(e.code)
    } else {
      setKey("")
    }

    if (e.code === "Space") {
      e.preventDefault()
    }

    const { selectionEnd, selectionStart } = e.currentTarget
    setSelection({ end: selectionEnd, start: selectionStart })
  }

  const handleAsnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { selectionEnd, selectionStart, value: inputAsnValue } = e.target
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

  const isAsnEditable =
    courtCase.canUserEditExceptions &&
    courtCase.phase === Phase.HEARING_OUTCOME &&
    isAsnException(courtCase.aho.Exceptions) &&
    currentUser.featureFlags?.exceptionsEnabled

  return (
    <EditableFieldTableRow
      className={"asn-row"}
      hasExceptions={isAsnEditable}
      hintText="ASN format: Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 1 to 11 digits and 1 check letter \n Example: 22/49AB/49/1234C"
      inputLabel="Enter the ASN"
      isEditable={isAsnEditable}
      label="ASN"
      updatedValue={updatedAhoAsn}
      value={defendant.ArrestSummonsNumber}
    >
      <div>
        <div>
          <AsnInput
            className={`asn-input`}
            error={!isValidAsn}
            id={"asn"}
            name={"asn"}
            onChange={handleAsnChange}
            onCopy={handleOnCopy}
            onCut={handleOnCopy}
            onKeyDown={handleOnKeyDown}
            onPaste={handleOnPaste}
            ref={asnInputRef}
            value={Asn.divideAsn(amendedAsn.toUpperCase())}
          />
        </div>
        <AutoSave
          amendmentFields={["asn"]}
          isChanged={asnChanged}
          isSaved={isSavedAsn}
          isValid={isValidAsn}
          setChanged={setAsnChanged}
          setSaved={setIsSavedAsn}
        >
          {!isValidAsn && <ErrorMessage message="Enter ASN in the correct format" />}
        </AutoSave>
      </div>
    </EditableFieldTableRow>
  )
}
