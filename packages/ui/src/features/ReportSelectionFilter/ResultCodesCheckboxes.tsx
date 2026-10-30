import Checkbox from "components/Checkbox/Checkbox"
import { SyntheticEvent } from "react"

interface ResultCodesCheckboxesProps {
  handleChange: (event: SyntheticEvent<HTMLInputElement>) => void
  activeResultCodes: string[]
}

const RESULT_CODES_LIST = [
  { id: "1032", name: "Community order amended" },
  { id: "1116", name: "Community order" },
  { id: "1030", name: "Community order varied" },
  { id: "4575", name: "Warrant for arrest for breach of community penalty with bail (dated)" },
  { id: "4577", name: "Warrant for arrest for community penalty breach with bail (undated)" },
  { id: "4576", name: "Warrant for arrest for community penalty breach without bail" },
  { id: "1507", name: "Suspended sentence of imprisonment implemented" },
  { id: "1508", name: "Suspended sentence order amended - imprisonment" },
  { id: "1115", name: "Suspended sentence order - imprisonment" },
  { id: "1134", name: "Suspended sentence order - detention" }
]

export const ResultCodesCheckboxes: React.FC<ResultCodesCheckboxesProps> = ({ handleChange, activeResultCodes }) => {
  return (
    <>
      <h2 className="govuk-heading-m">{"Include"}</h2>
      <label className="govuk-body" htmlFor="checkboxes-container">
        {"Select an option"}
      </label>
      <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
        {RESULT_CODES_LIST.map((resultCode) => (
          <Checkbox
            key={resultCode.id}
            label={resultCode.name}
            checked={activeResultCodes.includes(resultCode.id)}
            id={resultCode.id}
            onChange={handleChange}
          />
        ))}
      </div>
    </>
  )
}
