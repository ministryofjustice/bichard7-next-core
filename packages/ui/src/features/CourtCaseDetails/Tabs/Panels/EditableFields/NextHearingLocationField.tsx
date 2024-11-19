import { Result } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import AutoSave from "components/EditableFields/AutoSave"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import ErrorMessage from "components/EditableFields/ErrorMessage"
import OrganisationUnitTypeahead from "components/OrganisationUnitTypeahead"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { useState } from "react"
import { Exception } from "types/exceptions"
import OrganisationUnitApiResponse from "types/OrganisationUnitApiResponse"
import getNextHearingLocationValue from "utils/amendments/getAmendmentValues/getNextHearingLocationValue"
import hasNextHearingLocationException from "utils/exceptions/hasNextHearingLocationException"
import isValidNextHearingLocation from "utils/validators/isValidNextHearingLocation"

interface NextHearingLocationFieldProps {
  exceptions: Exception[]
  isCaseEditable: boolean
  offenceIndex: number
  result: Result
  resultIndex: number
}

export const NextHearingLocationField = ({
  exceptions,
  isCaseEditable,
  offenceIndex,
  result,
  resultIndex
}: NextHearingLocationFieldProps) => {
  const { amendments } = useCourtCase()
  const currentUser = useCurrentUser()
  const amendedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex) ?? ""
  const [isNhlSaved, setIsNhlSaved] = useState<boolean>(false)
  const [organisations, setOrganisations] = useState<OrganisationUnitApiResponse>([])
  const [isNhlChanged, setIsNhlChanged] = useState<boolean>(false)

  const isValidNhl = isValidNextHearingLocation(amendedNextHearingLocation, organisations)

  const isEditable =
    isCaseEditable && hasNextHearingLocationException(exceptions) && currentUser.featureFlags?.exceptionsEnabled

  return (
    <EditableFieldTableRow
      className={"next-hearing-location-row"}
      hasExceptions={hasNextHearingLocationException(exceptions)}
      hintText="OU code, 6-7 characters"
      inputLabel="Enter next hearing location"
      isEditable={isEditable}
      label="Next hearing location"
      updatedValue={amendedNextHearingLocation}
      value={result.NextResultSourceOrganisation?.OrganisationUnitCode}
    >
      <OrganisationUnitTypeahead
        offenceIndex={offenceIndex}
        resultIndex={resultIndex}
        setChanged={setIsNhlChanged}
        setOrganisations={setOrganisations}
        setSaved={setIsNhlSaved}
        value={amendedNextHearingLocation ?? result.NextResultSourceOrganisation?.OrganisationUnitCode}
      />
      <AutoSave
        amendmentFields={["nextSourceOrganisation"]}
        isChanged={isNhlChanged}
        isSaved={isNhlSaved}
        isValid={isValidNhl}
        setChanged={setIsNhlChanged}
        setSaved={setIsNhlSaved}
      >
        {isNhlChanged && !isValidNhl && <ErrorMessage message="Select valid Next hearing location" />}
      </AutoSave>
    </EditableFieldTableRow>
  )
}
