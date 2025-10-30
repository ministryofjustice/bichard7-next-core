import React from "react"

interface RememberProps {
  checked: boolean
}
export const RememberForm = ({ checked }: RememberProps) => (
  <div className="govuk-form-group govuk-!-padding-top-4">
    <fieldset className="govuk-fieldset" aria-describedby="waste-hint">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{"Sign in without a code next time"}</legend>
      <div className="govuk-checkboxes" data-module="govuk-checkboxes">
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id="rememberEmailYes"
            name="rememberEmailAddress"
            type="checkbox"
            value="yes"
            defaultChecked={checked}
          />
          <label className="govuk-label govuk-checkboxes__label" htmlFor="rememberEmailYes">
            {"I trust this device. I don't want to sign in with a code again today."}
          </label>
        </div>
        <div className="govuk-warning-text govuk-!-margin-bottom-0">
          <span className="govuk-warning-text__icon" aria-hidden="true">
            {"!"}
          </span>
          <strong className="govuk-warning-text__text">
            <span className="govuk-visually-hidden">{"Warning"}</span>
            {"Don't use this option if you are using a public or shared device."}
          </strong>
        </div>
      </div>
    </fieldset>
  </div>
)
