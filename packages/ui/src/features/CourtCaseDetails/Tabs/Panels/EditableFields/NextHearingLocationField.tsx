import { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import AutoSave from "components/EditableFields/AutoSave"
import EditableFieldRow from "components/EditableFields/EditableFieldRow"
import ErrorMessage from "components/EditableFields/ErrorMessage"
import OrganisationUnitTypeahead from "components/Typeaheads/OrganisationUnitTypeahead"
import { useCourtCase } from "context/CourtCaseContext"
import { useEffect, useState } from "react"
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
  const amendedNextHearingLocation = getNextHearingLocationValue(amendments, offenceIndex, resultIndex) ?? ""
  const [isNhlSaved, setIsNhlSaved] = useState<boolean>(false)
  const [loadingOrganisations, setLoadingOrganisations] = useState<boolean>(true)
  const [organisations, setOrganisations] = useState<OrganisationUnitApiResponse>([])
  const [isNhlChanged, setIsNhlChanged] = useState<boolean>(false)

  const originalCode = result.NextResultSourceOrganisation?.OrganisationUnitCode

  useEffect(() => {
    if (loadingOrganisations) {
      const fetchOrganisations = async () => {
        fetch(`/bichard/api/organisation-units`)
          .then((data) => {
            if (Array.isArray(data)) {
              setOrganisations(data)
            }
          })
          .catch((error) => {
            console.error("Error fetching organisation name:", error)
          })
      }
      fetchOrganisations().finally(() => setLoadingOrganisations(false))
    }
  }, [organisations])

  const isValidNhl = isValidNextHearingLocation(amendedNextHearingLocation, organisations)
  const isEditable = isCaseEditable && hasNextHearingLocationException(exceptions)

  const getDisplayValue = (code?: string | null) => {
    if (!code) {
      return ""
    }
    const matchingOrg = organisations.find((org) => org.fullOrganisationCode === code)
    return matchingOrg ? `${code} - ${matchingOrg.fullOrganisationName}` : code
  }

  return (
    <EditableFieldRow
      className={"next-hearing-location-row"}
      label="Next hearing location"
      hasExceptions={hasNextHearingLocationException(exceptions)}
      value={getDisplayValue(originalCode)}
      updatedValue={getDisplayValue(amendedNextHearingLocation)}
      isEditable={isEditable}
      inputLabel="Enter next hearing location"
      hintText="OU code, 6-7 characters"
      htmlFor={"next-hearing-location"}
    >
      <OrganisationUnitTypeahead
        value={isValidNhl ? amendedNextHearingLocation || originalCode || undefined : undefined}
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
    </EditableFieldRow>
  )
}
