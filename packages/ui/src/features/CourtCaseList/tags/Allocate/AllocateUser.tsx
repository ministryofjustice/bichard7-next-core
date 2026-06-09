import AllocateUserTypeahead from "@/components/Typeaheads/AllocateUserTypeahead"
import { Button } from "@/components/Buttons/Button"
import { useState } from "react"

export type AllocateUser = {
  id: number
  fullname: string
}

interface AllocateUserProps {
  type: "exceptions" | "triggers"
}

export const AllocateUser = ({ type }: AllocateUserProps) => {
  const [show, setShow] = useState(false)
  const [_, setSelectedUser] = useState<AllocateUser | null>(null)

  if (show) {
    return <AllocateUserTypeahead onSelect={setSelectedUser} />
  }

  return <Button onClick={() => setShow(true)}>{"Allocate " + type}</Button>
}
