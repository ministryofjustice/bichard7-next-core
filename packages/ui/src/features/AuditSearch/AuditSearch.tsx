import React, { type ChangeEvent, forwardRef, useActionState, useId, useRef, useState } from "react"
import { FormGroup } from "components/FormGroup"
import { IncludeRow, FormButtonRow } from "./AuditSearch.styles"
import { formatUserFullName } from "utils/formatUserFullName"
import { subDays, format, parse } from "date-fns"
import { RadioGroups } from "components/Radios/RadioGroup"
import RadioButton from "components/Radios/RadioButton"
import AuditResolvedBy from "../../types/AuditResolvedBy"
import type { CreateAuditInput } from "@moj-bichard7/common/contracts/CreateAuditInput"
import { AuditDtoSchema } from "@moj-bichard7/common/types/Audit"
import { useRouter } from "next/router"

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
  const idToUse = id ?? defaultId

  return (
    <div className="govuk-checkboxes__item">
      <input
        className="govuk-checkboxes__input"
        id={idToUse}
        checked={checked}
        defaultChecked={defaultChecked}
        name={name}
        type="checkbox"
        value={value}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      <label className="govuk-checkboxes__label" htmlFor={idToUse}>
        {label}
      </label>
    </div>
  )
})

AuditCheckbox.displayName = "AuditCheckbox"

interface FormState {
  resolvedBy: string[]
  triggers: string[]
  includeTriggers: boolean
  includeExceptions: boolean
  volume: string
  fromDate: Date
  toDate: Date
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

  const router = useRouter()

  const formRef = useRef<HTMLFormElement>(null)
  const resolvedByRefs = useRef<HTMLInputElement[]>([])

  const DATE_FORMAT = "yyyy-MM-dd"

  const volumes = ["10", "20", "50", "100"]

  async function handleFormChange() {
    const formData = new FormData(formRef.current as HTMLFormElement)
    const validationState = readFormState(formData)
    setFormValid(isFormValid(validationState))
  }

  function isFormValid(formState: FormState) {
    return (
      formState.fromDate <= formState.toDate &&
      formState.toDate <= new Date() &&
      formState.resolvedBy.length > 0 &&
      (formState.includeExceptions || formState.includeTriggers)
    )
  }

  function readFormState(formData: FormData): FormState {
    return {
      resolvedBy: formData.getAll("resolvedBy") as string[],
      triggers: formData.getAll("triggers") as string[],
      includeTriggers: formData.get("includeTriggers") === "on",
      includeExceptions: formData.get("includeExceptions") === "on",
      volume: formData.get("volume") as string,
      fromDate: parseDate(formData.get("fromDate") as string, DATE_FORMAT, new Date()),
      toDate: parseDate(formData.get("toDate") as string, DATE_FORMAT, new Date())
    }
  }

  async function submit(_formState: FormState, formData: FormData): Promise<FormState> {
    const newState = readFormState(formData)

    function createRequest() {
      const includedTypes: ("Exceptions" | "Triggers")[] = []
      if (newState.includeExceptions) {
        includedTypes.push("Exceptions")
      }
      if (newState.includeTriggers) {
        includedTypes.push("Triggers")
      }

      const request: CreateAuditInput = {
        fromDate: format(newState.fromDate, DATE_FORMAT),
        toDate: format(newState.toDate, DATE_FORMAT),
        includedTypes: includedTypes,
        volumeOfCases: parseInt(newState.volume),
        resolvedByUsers: newState.resolvedBy,
        triggerTypes: newState.triggers
      }
      return request
    }

    const request = createRequest()

    const result = await fetch(`/bichard/api/audit`, {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (result.ok) {
      const raw = await result.json()

      // todo: handle parse error, show message in UI

      const auditResult = AuditDtoSchema.parse(raw)
      await router.push(`/audit/${auditResult.auditId}`)
    }

    return newState
  }

  const [currentFormState, submitAction] = useActionState(submit, {
    resolvedBy: [],
    triggers: [],
    includeTriggers: false,
    includeExceptions: false,
    volume: "20",
    fromDate: subDays(new Date(), 7),
    toDate: new Date()
  })

  const [formValid, setFormValid] = useState(isFormValid(currentFormState))

  const [allResolversSelected, setAllResolversSelected] = useState<boolean>(
    resolvers.every((r) => currentFormState.resolvedBy.includes(r.username))
  )

  return (
    <form action={submitAction} onChange={handleFormChange} ref={formRef}>
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
                        name="fromDate"
                        max={format(new Date(), DATE_FORMAT)}
                        defaultValue={format(currentFormState.fromDate, DATE_FORMAT)}
                        onChange={(e) => {
                          if (!e.target.value) {
                            e.target.value = format(new Date(), DATE_FORMAT)
                          }
                        }}
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
                        name="toDate"
                        max={format(new Date(), DATE_FORMAT)}
                        defaultValue={format(currentFormState.toDate, DATE_FORMAT)}
                        onChange={(e) => {
                          if (!e.target.value) {
                            e.target.value = format(new Date(), DATE_FORMAT)
                          }
                        }}
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

                          resolvedByRefs.current.forEach(
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
                              resolvedByRefs.current.every((input) => (input as HTMLInputElement).checked)
                            )
                          }}
                          ref={(elem) => {
                            if (elem) {
                              resolvedByRefs.current[index] = elem
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
                        defaultChecked={currentFormState.volume == v}
                        id={`audit-volume-${v}`}
                        value={v}
                        label={`${v}% of cases`}
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
