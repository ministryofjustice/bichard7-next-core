import { useState } from "react"
import { FormGroup } from "components/FormGroup"
import { IncludeRow, FormButtonRow } from "./AuditSearch.styles"

interface Resolver {
  name: string
}

interface Props {
  resolvedBy: Resolver[]
  triggerTypes: string[]
}

const AuditSearch: React.FC<Props> = (props) => {
  const { resolvedBy, triggerTypes } = props

  const defaultVolume = "20"
  const volumes = ["10", "20", "50", "100"]

  const [volume, setVolume] = useState(defaultVolume)

  return (
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
                  <legend className="govuk-fieldset__legend--m">{"Dates"}</legend>
                  <FormGroup>
                    <label className="govuk-body" htmlFor="date-search-from">
                      {"From date"}
                    </label>
                    <input className="govuk-input" id="date-search-from" type="date" />
                  </FormGroup>
                  <FormGroup>
                    <label className="govuk-body" htmlFor="date-search-to">
                      {"To date"}
                    </label>
                    <input className="govuk-input" id="date-search-to" type="date" />
                  </FormGroup>
                </fieldset>
              </FormGroup>
              <FormGroup>
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-fieldset__legend--m govuk-!-margin-bottom-1">{"Include"}</legend>
                  <p className="govuk-body govuk-body-s govuk-!-margin-0">{"Select an option"}</p>
                  <IncludeRow className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        name="triggers"
                        id="date-search-triggers"
                        type="checkbox"
                        value="triggers"
                      />
                      <label className="govuk-label govuk-checkboxes__label" htmlFor="date-search-triggers">
                        {"Triggers"}
                      </label>
                    </div>
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        name="exceptions"
                        id="date-search-exceptions"
                        type="checkbox"
                        value="exceptions"
                      />
                      <label className="govuk-label govuk-checkboxes__label" htmlFor="date-search-exceptions">
                        {"Exceptions"}
                      </label>
                    </div>
                  </IncludeRow>
                </fieldset>
              </FormGroup>
            </div>
            <div className="govuk-grid-column-one-quarter">
              <FormGroup>
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-fieldset__legend--m">{"Resolved by"}</legend>
                  <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                    {resolvedBy.map((resolver, index) => {
                      return (
                        <div key={resolver.name} className="govuk-checkboxes__item">
                          <input
                            className="govuk-checkboxes__input"
                            name="exceptions"
                            id={`audit-resolved-by-${index}`}
                            type="checkbox"
                            value="exceptions"
                          />
                          <label className="govuk-label govuk-checkboxes__label" htmlFor={`audit-resolved-by-${index}`}>
                            {resolver.name}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </fieldset>
              </FormGroup>
            </div>
            <div className="govuk-grid-column-one-quarter">
              <FormGroup>
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-fieldset__legend--m">{"Trigger type"}</legend>
                  <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                    {triggerTypes.map((triggerType, index) => {
                      return (
                        <div key={triggerType} className="govuk-checkboxes__item">
                          <input
                            className="govuk-checkboxes__input"
                            name="exceptions"
                            id={`audit-trigger-type-${index}`}
                            type="checkbox"
                            value="exceptions"
                          />
                          <label
                            className="govuk-label govuk-checkboxes__label"
                            htmlFor={`audit-trigger-type-${index}`}
                          >
                            {triggerType}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </fieldset>
              </FormGroup>
            </div>
            <div className="govuk-grid-column-one-quarter">
              <FormGroup>
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-fieldset__legend--m">{"Volume of cases"}</legend>
                  <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
                    {volumes.map((v) => {
                      return (
                        <div key={v} className="govuk-radios__item">
                          <input
                            className="govuk-radios__input"
                            type="radio"
                            name="volume"
                            checked={v == volume}
                            id={`audit-volume-${v}`}
                            value={v}
                            onChange={(e) => setVolume(e.target.value)}
                          />
                          <label className="govuk-label govuk-radios__label" htmlFor={`audit-volume-${v}`}>
                            {v}
                            {"% of cases"}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </fieldset>
              </FormGroup>
            </div>
          </div>
          <FormButtonRow>
            <button className="govuk-button">{"Search cases"}</button>
            <p className="govuk-body">
              <a href="/bichard/audit/search" className="govuk-link govuk-link--no-visited-state">
                {"Clear search"}
              </a>
            </p>
          </FormButtonRow>
        </div>
      </div>
    </div>
  )
}

export default AuditSearch
