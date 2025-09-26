import { forces, triggerDefinitions } from "@moj-bichard7-developers/bichard7-next-data"
import CheckboxMultiSelect from "components/CheckboxMultiSelect"
import Details from "components/Details"
import TextInput from "components/TextInput"
import React from "react"
import { UserGroupResult } from "types/UserGroup"

interface Props {
  username?: string
  forenames?: string
  surname?: string
  emailAddress?: string
  endorsedBy?: string
  orgServes?: string
  userGroups?: UserGroupResult[]
  allGroups?: UserGroupResult[]
  visibleForces?: string
  visibleCourts?: string
  excludedTriggers?: string
  usernameError?: string | false
  forenamesError?: string | false
  surnameError?: string | false
  emailError?: string | false
  forcesError?: string | false
  isCurrentSuperUser?: boolean
  isEdit?: boolean
  currentUserVisibleForces: string
}

export const listOfForces = forces
  .map(({ code, name }) => ({ id: code, name: name }))
  .filter((x: { id: string; name: string }) => x.id[0] !== "B" && x.id[0] !== "C")
  .map(({ id, name }) => ({ id: parseInt(id, 10).toString().padStart(3, "0"), name }))
  .sort((x: { id: string; name: string }, y: { id: string; name: string }) => (x.id > y.id ? 1 : -1))

export const listOfTriggers = triggerDefinitions.map(({ code, description }) => ({ id: code, name: description }))

const UserForm = ({
  username,
  forenames,
  surname,
  emailAddress,
  endorsedBy,
  orgServes,
  userGroups,
  allGroups,
  visibleForces,
  visibleCourts,
  excludedTriggers,
  usernameError,
  forenamesError,
  surnameError,
  emailError,
  forcesError,
  currentUserVisibleForces,
  isCurrentSuperUser = false,
  isEdit = false
}: Props) => {
  let forcesCheckboxClassName = "govuk-form-group"
  if (forcesError) {
    forcesCheckboxClassName += " govuk-form-group--error"
  }
  return (
    <>
      <TextInput
        name="username"
        label="Username"
        error={usernameError}
        value={username}
        readOnly={isEdit}
        disabled={isEdit}
        width="20"
        mandatory
      />
      <TextInput name="forenames" label="Forename(s)" error={forenamesError} value={forenames} width="20" mandatory />
      <TextInput name="surname" label="Surname" error={surnameError} value={surname} width="20" mandatory />
      <TextInput
        name="emailAddress"
        label="Email address"
        type="email"
        value={emailAddress}
        error={emailError}
        width="20"
        mandatory
      />

      {!isEdit && <TextInput value={endorsedBy} name="endorsedBy" label="Endorsed by" width="20" readOnly />}

      <TextInput value={orgServes} name="orgServes" label="Organisation" width="20" />

      <div className="govuk-form-group" data-test="checkbox-user-groups">
        <CheckboxMultiSelect
          displayValueMappingFn={(item) => (item.friendly_name ? item.friendly_name : item.name)}
          nameMappingFn={(item) => `${item?.name}`}
          idMappingFn={(item) => `${item?.id}`}
          keymappingFn={(item) => `${item?.id}`}
          allOptions={allGroups}
          hintLabel="Select the groups the user belongs to"
          selectedOptions={userGroups}
        />
      </div>

      <div className={forcesCheckboxClassName}>
        <CheckboxMultiSelect
          idMappingFn={(item) => `visibleForces${item?.id}`}
          nameMappingFn={(item) => `visibleForces${item?.id}`}
          keymappingFn={(item) => `visibleForces${item?.id}`}
          displayValueMappingFn={(item) => `${item.id} - ${item.name}`}
          hintLabel="Show records from the following forces"
          isError={forcesError}
          selectedOptions={visibleForces}
          allOptions={listOfForces.filter((x) => isCurrentSuperUser || currentUserVisibleForces.includes(x.id))}
        />
      </div>

      <div className="govuk-form-group">
        <TextInput
          value={visibleCourts}
          name="visibleCourts"
          label="Also, show records from these specific Courts"
          width="20"
        />
      </div>

      <div className="govuk-form-group">
        <Details summary={"Included Triggers"} data-test="included-triggers">
          <CheckboxMultiSelect
            idMappingFn={(item) => `excludedTriggers${item?.id}`}
            nameMappingFn={(item) => `excludedTriggers${item?.id}`}
            keymappingFn={(item) => `excludedTriggers${item?.id}`}
            displayValueMappingFn={(item) => `${item.id} - ${item.name}`}
            hintLabel="All triggers that are visible to the user"
            selectedOptions={listOfTriggers.filter((x) => !excludedTriggers?.includes(x.id))}
            allOptions={listOfTriggers}
          />
        </Details>
      </div>
    </>
  )
}

export default UserForm
