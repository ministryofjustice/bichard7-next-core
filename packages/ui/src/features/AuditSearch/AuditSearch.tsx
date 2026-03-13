import React, { type ChangeEvent, forwardRef, useActionState, useId, useRef, useState } from "react"
import { FormGroup } from "components/FormGroup"
import { IncludeRow, FormButtonRow } from "./AuditSearch.styles"
import { formatUserFullName } from "utils/formatUserFullName"
import { subDays, format, parse } from "date-fns"
import { RadioGroups } from "components/Radios/RadioGroup"
import RadioButton from "components/Radios/RadioButton"
import AuditResolvedBy from "../../types/AuditResolvedBy"

interface AuditCheckboxProps {
  id?: string
  name?: string
  defaultChecked?: boolean
  checked?: boolean
  label: string
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const AuditCheckbox = forwardRef<HTMLInputElement, AuditCheckboxProps>((props, ref) => {
  const { id, name, defaultChecked, checked, label, value, onChange } = props
  const defaultId = useId()

  return (
    <div className="govuk-checkboxes__item">
      <input
        className="govuk-checkboxes__input"
        id={id ?? defaultId}
        checked={checked}
        defaultChecked={defaultChecked}
        name={name}
        type="checkbox"
        value={value}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      <label className="govuk-checkboxes__label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
})

AuditCheckbox.displayName = "AuditCheckbox"

interface FormState {
  errorMessage: string
  resolvedBy: string[]
  includeTriggers: boolean
  includeExceptions: boolean
  volume: string
}

function parseDate(dateStr: string, format: string, defaultDate: Date): Date {
  const parsedDate = parse(dateStr, format, new Date())
  if (Number.isNaN(parsedDate.getTime())) {
    return new Date(defaultDate)
  }
  return parsedDate
}

const AuditSearch: React.FC<{ resolvers: AuditResolvedBy[]; triggerTypes: string[] }> = (props) => {
  const { resolvers, triggerTypes } = props

  const resolvedByFields = useRef<HTMLInputElement[]>([])

  const DATE_FORMAT = "yyyy-MM-dd"

  const defaultVolume = "20"
  const volumes = ["10", "20", "50", "100"]

  const today = new Date()

  const [volume, setVolume] = useState(defaultVolume)
  const [fromDate, setFromDate] = useState(subDays(new Date(), 7))
  const [toDate, setToDate] = useState(new Date())

  const formValid = fromDate <= toDate && toDate <= today

  async function submit(formState: FormState, formData: FormData) {
    const newState = {
      ...formState,
      errorMessage: "",
      resolvedBy: formData.getAll("resolvedBy") as string[],
      triggers: formData.getAll("triggers") as string[],
      includeTriggers: formData.get("includeTriggers") === "on",
      includeExceptions: formData.get("includeExceptions") === "on",
      volume: formData.get("volume") as string
    }
    console.log("New state", newState)

    return newState
  }

  const [currentFormState, submitAction] = useActionState(submit, {
    errorMessage: "",
    resolvedBy: [],
    triggers: [],
    includeTriggers: false,
    includeExceptions: false,
    volume: defaultVolume
  })

  const [allResolversSelected, setAllResolversSelected] = useState<boolean>(
    resolvers.every((r) => currentFormState.resolvedBy.includes(r.username))
  )

  return (
    <form action={submitAction}>
      <div className="moj-filter">
        <div className="moj-filter__header">
          <div className="moj-filter__header-title">
            <h2 className="govuk-heading-m">{"Audit search"}</h2>
          </div>
        </div>
        <div className="moj-filter__content">
          <div className="moj-filter__options">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-one-quarter">
                <FormGroup>
                  <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{"Dates"}</legend>
                    <FormGroup>
                      <label className="govuk-body" htmlFor="audit-date-from">
                        {"From date"}
                      </label>
                      <input
                        data-testid="audit-date-from"
                        className="govuk-input"
                        type="date"
                        max={format(today, DATE_FORMAT)}
                        value={format(fromDate, DATE_FORMAT)}
                        onChange={(e) => setFromDate(parseDate(e.target.value, DATE_FORMAT, today))}
                      />
                    </FormGroup>
                    <FormGroup>
                      <label className="govuk-body" htmlFor="audit-date-to">
                        {"To date"}
                      </label>
                      <input
                        data-testid="audit-date-to"
                        className="govuk-input"
                        type="date"
                        max={format(today, DATE_FORMAT)}
                        value={format(toDate, DATE_FORMAT)}
                        onChange={(e) => setToDate(parseDate(e.target.value, DATE_FORMAT, today))}
                      />
                    </FormGroup>
                  </fieldset>
                </FormGroup>
                <FormGroup>
                  <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s govuk-!-margin-bottom-1">
                      {"Include"}
                    </legend>
                    <p className="govuk-body govuk-body-s govuk-!-margin-0">{"Select an option"}</p>
                    <IncludeRow className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                      <AuditCheckbox
                        name={"includeTriggers"}
                        defaultChecked={currentFormState.includeTriggers}
                        label={"Triggers"}
                      />
                      <AuditCheckbox
                        name={"includeExceptions"}
                        defaultChecked={currentFormState.includeExceptions}
                        label={"Exceptions"}
                      />
                    </IncludeRow>
                  </fieldset>
                </FormGroup>
              </div>
              <div className="govuk-grid-column-one-quarter">
                <FormGroup>
                  <fieldset className="govuk-fieldset" id="audit-search-resolved-by">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{"Resolved by"}</legend>
                    <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                      <AuditCheckbox
                        checked={allResolversSelected}
                        label={"All"}
                        data-testid={"audit-resolved-by-all"}
                        onChange={(e) => {
                          console.log("toggle", e.target.checked)

                          resolvedByFields.current.forEach(
                            (input) => ((input as HTMLInputElement).checked = e.target.checked)
                          )
                          setAllResolversSelected(e.target.checked)
                        }}
                      />
                      {resolvers.map((resolver, index) => (
                        <AuditCheckbox
                          key={index}
                          id={`resolvers${index}`}
                          name="resolvedBy"
                          value={resolver.username}
                          defaultChecked={currentFormState.resolvedBy.includes(resolver.username)}
                          label={formatUserFullName(resolver.forenames, resolver.surname)}
                          data-testid={`audit-resolved-by-${index}`}
                          onChange={(_) => {
                            setAllResolversSelected(
                              resolvedByFields.current.every((input) => (input as HTMLInputElement).checked)
                            )
                          }}
                          ref={(elem) => {
                            if (elem) {
                              resolvedByFields.current[index] = elem
                            }
                          }}
                        />
                      ))}
                    </div>
                  </fieldset>
                </FormGroup>
              </div>
              <div className="govuk-grid-column-one-quarter">
                <FormGroup>
                  <fieldset className="govuk-fieldset" id="audit-search-triggers">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{"Trigger type"}</legend>
                    <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                      {triggerTypes.map((triggerType, index) => (
                        <AuditCheckbox
                          key={index}
                          name="triggers"
                          value={triggerType}
                          defaultChecked={currentFormState.triggers.includes(triggerType)}
                          label={triggerType}
                          data-testid={`audit-trigger-type-${index}`}
                        />
                      ))}
                    </div>
                  </fieldset>
                </FormGroup>
              </div>
              <div className="govuk-grid-column-one-quarter">
                <RadioGroups legendText={"Volume of cases"} id="audit-search-volume">
                  <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
                    {volumes.map((v) => (
                      <RadioButton
                        name={"volume"}
                        id={`audit-volume-${v}`}
                        onChange={(e) => setVolume(e.target.value)}
                        label={`${v}% of cases`}
                        checked={v == volume}
                        value={v}
                        key={v}
                      />
                    ))}
                  </div>
                </RadioGroups>
              </div>
            </div>
            <FormButtonRow>
              <button name="audit-search-button" className="govuk-button" disabled={!formValid}>
                {"Search cases"}
              </button>
              <p className="govuk-body">
                <a href="/bichard/audit/search" className="govuk-link govuk-link--no-visited-state">
                  {"Clear search"}
                </a>
              </p>
            </FormButtonRow>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AuditSearch
