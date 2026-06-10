import AutoSaveBase from "components/EditableFields/AutoSaveBase"
import { Button } from "@/components/Buttons/Button"
import AllocateUserTypeahead from "@/components/Typeaheads/AllocateUserTypeahead"
import { useCallback, useRef, useState } from "react"
import { UserLookupDto } from "@moj-bichard7/common/types/User"
import { ColumnType } from "../../CourtCaseListEntry/CourtCaseListEntryCells/generateAllocationComponent"

interface AllocateUserProps {
  columnType: ColumnType
  caseId: number
}

export const AllocateUser = ({ columnType, caseId }: AllocateUserProps) => {
  const [show, setShow] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserLookupDto | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const selectedUserRef = useRef<UserLookupDto | null>(null)

  const handleSelect = (user: UserLookupDto | null) => {
    selectedUserRef.current = user
    setSelectedUser(user)
    setIsChanged(!!user)
    setIsSaved(false)
  }

  const onSave = useCallback(async () => {
    const user = selectedUserRef.current
    if (!user) {
      return
    }

    const response = await fetch(`/bichard/api/court-cases/${caseId}/allocate?caseType=${columnType}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, fullname: user.fullname } satisfies UserLookupDto)
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }
  }, [caseId])

  if (show) {
    return (
      <AutoSaveBase
        isValid={!!selectedUser}
        isSaved={isSaved}
        isChanged={isChanged}
        setSaved={setIsSaved}
        setChanged={setIsChanged}
        onSave={onSave}
      >
        <AllocateUserTypeahead onSelect={handleSelect} />
      </AutoSaveBase>
    )
  }

  return <Button onClick={() => setShow(true)}>{"Allocate " + columnType}</Button>
}
