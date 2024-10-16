import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
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
  const { courtCase, amendments, amend } = useCourtCase()
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

  const amendAsn = (asn: string, selectionStart: number | null, selectionEnd: number | null) => {
    amend("asn")(asn.toUpperCase().replace(/\//g, ""))

    setSelection({ start: selectionStart, end: selectionEnd })
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

    const { selectionStart, selectionEnd } = e.currentTarget
    setSelection({ start: selectionStart, end: selectionEnd })
  }

  const handleAsnChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value: inputAsnValue, selectionStart, selectionEnd } = e.target
    amendAsn(inputAsnValue, selectionStart, selectionEnd)
  }

  const handleOnPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const asnFromClipboard = e.clipboardData.getData("text")
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
      value={defendant.ArrestSummonsNumber}
      updatedValue={updatedAhoAsn}
      label="ASN"
      hasExceptions={isAsnEditable}
      isEditable={isAsnEditable}
      inputLabel="Enter the ASN"
      hintText="ASN format: Last 2 digits of year / 4 divisional ID location characters / 2 digits from owning force / 1 to 11 digits and 1 check letter \n Example: 22/49AB/49/1234C"
    >
      <div>
        <div>
          <AsnInput
            ref={asnInputRef}
            className={`asn-input`}
            id={"asn"}
            name={"asn"}
            onChange={handleAsnChange}
            value={Asn.divideAsn(amendedAsn.toUpperCase())}
            error={!isValidAsn}
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
    </EditableFieldTableRow>
  )
}
