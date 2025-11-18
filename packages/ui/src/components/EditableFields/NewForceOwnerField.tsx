import { useState } from "react"
import ForceOwnerTypeahead from "../ForceOwnerTypeahead"
import type ForceOwnerApiResponse from "../../types/ForceOwnerApiResponse"

interface Props {
  currentForceOwner?: string
}

export const NewForceOwnerField = ({ currentForceOwner }: Props) => {
  const [selectedForce, setSelectedForce] = useState<ForceOwnerApiResponse[0] | null>(null)

  return (
    <>
      <input type="hidden" name="force" value={selectedForce?.forceCode ?? ""} />

      <ForceOwnerTypeahead onSelect={setSelectedForce} currentForceOwner={currentForceOwner} />
    </>
  )
}
