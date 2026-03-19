import React, { useActionState, useEffect, useRef, useState } from "react"
import { FormGroup } from "components/FormGroup"
import { IncludeRow, FormButtonRow } from "./AuditSearch.styles"
import { formatUserFullName } from "utils/formatUserFullName"
import { subDays, format } from "date-fns"
import { RadioGroups } from "components/Radios/RadioGroup"
import RadioButton from "components/Radios/RadioButton"
import AuditResolvedBy from "../../types/AuditResolvedBy"
import type { CreateAuditInput } from "@moj-bichard7/common/contracts/CreateAuditInput"
import { AuditDtoSchema } from "@moj-bichard7/common/types/Audit"
import { useRouter } from "next/router"
import { useFormStatus } from "react-dom"
import { Button } from "../../components/Buttons/Button"
import Checkbox from "../../components/Checkbox/Checkbox"
import parseDate from "../../utils/parseDate"

interface FormState {
  resolvedBy: string[]
  triggers: string[]
  includeTriggers: boolean
  includeExceptions: boolean
  volume: string
  fromDate: Date
  toDate: Date
  auditId?: number
}

const AuditSearchSubmitButton: React.FC<{ formValid: boolean }> = ({ formValid, ...props }) => {
  const formStatus = useFormStatus()
  return (
    <Button {...props} name="audit-search-button" disabled={!formValid || formStatus.pending}>
      {"Search cases"}
    </Button>
  )
}

const AuditSearch: React.FC<{ resolvers: AuditResolvedBy[]; triggerTypes: string[] }> = (props) => {
  const { resolvers, triggerTypes } = props

  const router = useRouter()

  const formRef = useRef<HTMLFormElement>(null)
  const resolvedByRefs = useRef<HTMLInputElement[]>([])

  const [errorMessage, setErrorMessage] = useState("")

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
        volumeOfCases: Number.parseInt(newState.volume, 10),
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

    setErrorMessage(result.ok ? "" : "There was a problem creating the audit report")

    if (result.ok) {
      const raw = await result.json()

      const auditResult = AuditDtoSchema.safeParse(raw)
      if (auditResult.success) {
        return { ...newState, auditId: auditResult.data.auditId }
      } else {
        setErrorMessage("There was a problem creating the audit report")
      }
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

  useEffect(() => {
    if (currentFormState.auditId) {
      router.push(`/audit/${currentFormState.auditId}`)
    }
  }, [currentFormState.auditId, router])

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
                      <Checkbox
                        name={"includeTriggers"}
                        defaultChecked={currentFormState.includeTriggers}
                        label={"Triggers"}
                      />
                      <Checkbox
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
                      <Checkbox
                        checked={allResolversSelected}
                        label={"All"}
                        data-testid={"audit-resolved-by-all"}
                        onChange={(e) => {
                          resolvedByRefs.current.forEach(
                            (input) => ((input as HTMLInputElement).checked = e.target.checked)
                          )
                          setAllResolversSelected(e.target.checked)
                        }}
                      />
                      {resolvers.map((resolver, index) => (
                        <Checkbox
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
                        <Checkbox
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
              {errorMessage ? (
                <p role="alert" className="govuk-body govuk-error-message">
                  <span className="govuk-visually-hidden">{"Error:"}</span> {errorMessage}
                </p>
              ) : null}
              <AuditSearchSubmitButton formValid={formValid} />
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
