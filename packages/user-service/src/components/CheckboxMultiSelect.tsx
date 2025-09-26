import { Fieldset } from "./Fieldset"

interface Props {
  /** All available options, these will be rendered as a checkbox. */
  allOptions: CheckBoxObject[] | undefined
  /** The options that are currently selected, this will drive what checkboxes are ticked. */
  selectedOptions: CheckBoxObject[] | string | undefined
  /** Provides a hint to the user on what the checkboxes show. */
  hintLabel: string
  controlLabel?: string
  isError?: string | false
  /** Provide a function to output the required displayed value for each checkbox, this function has access to
   *  the object being iterated over
   */
  displayValueMappingFn: (item: CheckBoxObject) => string
  /** Provide a function to output the required name for each checkbox, this function has access to
   *  the object being iterated over
   */
  nameMappingFn: (item?: CheckBoxObject) => string
  /** Provide a function to output the required id for each checkbox, this function has access to
   *  the object being iterated over
   */
  idMappingFn: (item?: CheckBoxObject) => string
  /** Provide a function to output the required key for each checkbox, this function has access to
   *  the object being iterated over
   */
  keymappingFn: (item?: CheckBoxObject) => string
}

export interface CheckBoxObject {
  id: string
  name: string
  friendly_name?: string
}

function isSelectedOption(selectedItems: CheckBoxObject[] | string | undefined, item: CheckBoxObject): boolean {
  if (Array.isArray(selectedItems)) {
    return selectedItems?.find((selectedItem) => selectedItem.id === item.id) !== undefined
  }
  if (typeof selectedItems === "string") {
    return selectedItems?.includes(item.id)
  }
  return false
}

const CheckboxMultiSelect = ({
  allOptions,
  selectedOptions,
  controlLabel,
  hintLabel,
  isError = false,
  displayValueMappingFn,
  nameMappingFn,
  idMappingFn,
  keymappingFn
}: Props) => {
  return (
    <Fieldset>
      {!isError || (
        <span id="forces-error" className="govuk-error-message">
          <span className="govuk-visually-hidden">{"Error:"}</span> {isError}
        </span>
      )}
      <legend data-test="checkbox-multiselect-legend" className="govuk-fieldset__legend govuk-fieldset__legend--l">
        <h5 className="govuk-fieldset__heading">{controlLabel}</h5>
      </legend>
      <div id="checkbox-group-hint" data-test="checkbox-multiselect-hint" className="govuk-hint">
        {hintLabel}
      </div>
      <div data-test="checkbox-multiselect-checkboxes" className="govuk-checkboxes" data-module="govuk-checkboxes">
        {allOptions?.map((group: CheckBoxObject) => (
          <div key={keymappingFn(group)} className="govuk-checkboxes__item">
            <input
              className="govuk-checkboxes__input"
              id={idMappingFn(group)}
              name={nameMappingFn(group)}
              type="checkbox"
              value={"yes"}
              defaultChecked={isSelectedOption(selectedOptions, group)}
            />

            <label
              data-test={nameMappingFn(group)}
              className="govuk-label govuk-checkboxes__label"
              htmlFor={idMappingFn(group)}
            >
              {displayValueMappingFn(group)}
            </label>
          </div>
        ))}
      </div>
    </Fieldset>
  )
}

export default CheckboxMultiSelect
