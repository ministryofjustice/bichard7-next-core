import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import AutoSave from "components/EditableFields/AutoSave"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import ErrorMessage from "components/EditableFields/ErrorMessage"
import OrganisationUnitTypeahead from "components/OrganisationUnitTypeahead"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { useState } from "react"
import OrganisationUnitApiResponse from "types/OrganisationUnitApiResponse"
import { Exception } from "types/exceptions"
import getNextHearingLocationValue from "utils/amendments/getAmendmentValues/getNextHearingLocationValue"
import hasNextHearingLocationException from "utils/exceptions/hasNextHearingLocationException"
import isValidNextHearingLocation from "utils/validators/isValidNextHearingLocation"

interface NextHearingLocationFieldProps {
  result: Result
  exceptions: Exception[]
  offenceIndex: number
  resultIndex: number
  isCaseEditable: boolean
}

export const NextHearingLocationField = ({
  result,
  exceptions,
  offenceIndex,
  resultIndex,
  isCaseEditable
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
      label="Next hearing location"
      hasExceptions={hasNextHearingLocationException(exceptions)}
      value={result.NextResultSourceOrganisation?.OrganisationUnitCode}
      updatedValue={amendedNextHearingLocation}
      isEditable={isEditable}
      inputLabel="Enter next hearing location"
      hintText="OU code, 6-7 characters"
    >
      <OrganisationUnitTypeahead
        value={amendedNextHearingLocation ?? result.NextResultSourceOrganisation?.OrganisationUnitCode}
        resultIndex={resultIndex}
        offenceIndex={offenceIndex}
        setOrganisations={setOrganisations}
        setChanged={setIsNhlChanged}
        setSaved={setIsNhlSaved}
      />
      <AutoSave
        setChanged={setIsNhlChanged}
        setSaved={setIsNhlSaved}
        isValid={isValidNhl}
        amendmentFields={["nextSourceOrganisation"]}
        isChanged={isNhlChanged}
        isSaved={isNhlSaved}
      >
        {isNhlChanged && !isValidNhl && <ErrorMessage message="Select valid Next hearing location" />}
      </AutoSave>
    </EditableFieldTableRow>
  )
}
