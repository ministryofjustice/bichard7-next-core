import { useCsrfToken } from "context/CsrfTokenContext"
import { isEmpty } from "lodash"
import { useCallback } from "react"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import excludeSavedAmendments from "utils/autoSave/excludeSavedAmendments"
import { useCourtCase } from "../../context/CourtCaseContext"
import { AmendmentKeys, OffenceField, ResultQualifierCode } from "../../types/Amendments"
import AutoSaveBase from "./AutoSaveBase"

interface AutoSaveProps {
  setSaved: (saved: boolean) => void
  setChanged: (changed: boolean) => void
  isValid: boolean
  isSaved: boolean
  isChanged: boolean
  amendmentFields: AmendmentKeys[]
  children?: React.ReactNode
}

const AutoSave = ({ setSaved, setChanged, isValid, isSaved, isChanged, amendmentFields, children }: AutoSaveProps) => {
  const { courtCase, amendments, savedAmend, savedAmendments, updateCourtCase } = useCourtCase()
  const { updateCsrfToken } = useCsrfToken()

  const onSave = useCallback(async () => {
    const update = excludeSavedAmendments(amendmentFields, amendments, savedAmendments)

    if (isEmpty(update)) {
      setSaved(true)
      setChanged(false)

      return
    }

    const response = await fetch(`/bichard/api/court-cases/${courtCase.errorId}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update)
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()

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

    updateCourtCase(data.courtCase satisfies DisplayFullCourtCase)
    updateCsrfToken(data.csrfToken as string)
  }, [
    amendmentFields,
    amendments,
    courtCase.errorId,
    savedAmend,
    savedAmendments,
    setChanged,
    setSaved,
    updateCourtCase,
    updateCsrfToken
  ])

  return (
    <AutoSaveBase
      setSaved={setSaved}
      setChanged={setChanged}
      isValid={isValid}
      isSaved={isSaved}
      isChanged={isChanged}
      onSave={onSave}
    >
      {children}
    </AutoSaveBase>
  )
}

export default AutoSave
