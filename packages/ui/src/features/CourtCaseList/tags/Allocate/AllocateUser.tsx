import { Button } from "@/components/Buttons/Button"
import { AllocateUserTypeahead } from "@/components/Typeaheads/AllocateUserTypeahead"
import { useState } from "react"

interface AllocateUserProps {
  type: "exceptions" | "triggers"
}

export const AllocateUser = ({ type }: AllocateUserProps) => {
  const [show, setShow] = useState(false)

  if (show) {
    return <AllocateUserTypeahead />
  }

  return <Button onClick={() => setShow(true)}>{"Allocate " + type}</Button>
}
