import ForceOwnerTypeahead from "components/Typeaheads/ForceOwnerTypeahead"
import { Dispatch, SetStateAction } from "react"

interface Props {
  currentForceOwner?: string
  setSelectedForce: Dispatch<
    SetStateAction<{
      forceCode: string
      forceName: string
    } | null>
  >
  selectedForce?: {
    forceCode: string
    forceName: string
  } | null
  showError?: boolean
}

export const NewForceOwnerField = ({ currentForceOwner, setSelectedForce, selectedForce, showError }: Props) => {
  return (
    <>
      <input type="hidden" name="force" value={selectedForce?.forceCode ?? ""} />

      <ForceOwnerTypeahead onSelect={setSelectedForce} currentForceOwner={currentForceOwner} showError={showError} />
    </>
  )
}
