import { useEffect, useState, type Dispatch } from "react"
import type { FilterAction, FilterState } from "types/CourtCaseFilter"
import TextFilter from "./TextFilter"

interface Props {
  value: {
    value?: string
    state?: FilterState
    label?: string
  }[]
  dispatch: Dispatch<FilterAction>
}

const tokenise = (input: string): string[] => input.split(" ").filter((x) => x)

const ReasonCodeFilter: React.FC<Props> = ({ value, dispatch }: Props) => {
  const [rawValue, setRawValue] = useState<string>("")
  const valueString = value.map((reasonCode) => reasonCode.value).join(" ")

  const hasChanged = (newValue: string): boolean => tokenise(rawValue).join(" ") !== newValue

  useEffect(() => setRawValue(valueString), [valueString])

  const handleChange: Dispatch<FilterAction> = (updated) => {
    // The type can be string or string[] but in practice we convert from string to string[]
    if (updated.type !== "reasonCodes" || Array.isArray(updated.value)) {
      return
    }

    const updateValue = updated.value.toUpperCase()

    setRawValue(updateValue)

    if (hasChanged(updateValue)) {
      dispatch({ ...updated, type: "reasonCodes", value: tokenise(updateValue) })
    }
  }

  return <TextFilter label={"Reason codes"} id="reasonCodes" dispatch={handleChange} value={rawValue} />
}

export default ReasonCodeFilter
