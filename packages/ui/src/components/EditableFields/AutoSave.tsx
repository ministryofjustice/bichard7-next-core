import axios from "axios"
import { isEmpty } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import excludeSavedAmendments from "utils/autoSave/excludeSavedAmendments"
import { useCourtCase } from "../../context/CourtCaseContext"
import { AmendmentKeys, OffenceField, ResultQualifierCode } from "../../types/Amendments"
import ErrorMessage from "./ErrorMessage"
import SuccessMessage from "./SuccessMessage"

interface AutoSaveProps {
  setSaved: (onSave: boolean) => void
  setChanged: (onChanged: boolean) => void
  isValid: boolean
  isSaved: boolean
  isChanged: boolean
  amendmentFields: AmendmentKeys[]
  children?: React.ReactNode
}

const AutoSave = ({ setSaved, setChanged, isValid, isSaved, isChanged, amendmentFields, children }: AutoSaveProps) => {
  const { courtCase, amendments, savedAmend, savedAmendments, updateCourtCase } = useCourtCase()
  const [saving, setSaving] = useState<boolean>(false)
  const [httpResponseStatus, setHttpResponseStatus] = useState<number | undefined>(undefined)
  const [httpResponseError, setHttpResponseError] = useState<Error | undefined>(undefined)

  const saveAmendments = useCallback(async () => {
    if (saving) {
      return
    }
    setSaving(true)

    const update = excludeSavedAmendments(amendmentFields, amendments, savedAmendments)

    try {
      if (isEmpty(update)) {
        setSaving(false)
        setSaved(true)
        setChanged(false)
        return
      }
      await axios.put(`/bichard/api/court-cases/${courtCase.errorId}/update`, update).then((response) => {
        setHttpResponseStatus(response.status)

        Object.keys(update).forEach((updateKey) => {
          if (Array.isArray(update[updateKey])) {
            update[updateKey].forEach(
              (updatedAmendment: OffenceField<number> | OffenceField<string> | ResultQualifierCode) =>
                savedAmend(updateKey as AmendmentKeys)(updatedAmendment)
            )
          } else {
            savedAmend(updateKey as AmendmentKeys)(update[updateKey])
          }
        })

        updateCourtCase(response.data.courtCase as DisplayFullCourtCase)
      })
    } catch (error) {
      setHttpResponseError(error as Error)
    } finally {
      setSaving(false)
    }

    setSaved(true)
    setChanged(false)
  }, [
    amendmentFields,
    amendments,
    courtCase.errorId,
    savedAmend,
    savedAmendments,
    saving,
    setChanged,
    setSaved,
    updateCourtCase
  ])

  useEffect(() => {
    if (!isValid) {
      setHttpResponseStatus(undefined)
      return
    }

    if (isSaved || !isChanged) {
      return
    }

    saveAmendments()
  }, [isValid, saveAmendments, isSaved, isChanged])

  return (
    <>
      {children}
      {httpResponseStatus === 200 && <SuccessMessage message="Input saved" />}
      {httpResponseError && <ErrorMessage message="Autosave has failed, please refresh" />}
    </>
  )
}

export default AutoSave
