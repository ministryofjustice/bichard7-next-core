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
  const [organisations, setOrganisations] = useState<OrganisationUnitApiResponse | undefined>(undefined)
  const [isNhlChanged, setIsNhlChanged] = useState<boolean>(false)

  const isValidNhl = isValidNextHearingLocation(amendedNextHearingLocation, organisations ?? [])

  const isEditable = isCaseEditable && hasNextHearingLocationException(exceptions)

  const getDisplayValue = (value?: string | null) => {
    if (!value) {
      return ""
    }
    if (organisations === undefined) {
      return value
    }

    const foundOrg = organisations.find((org) => org.fullOrganisationCode === value)
    return foundOrg ? `${foundOrg.fullOrganisationCode} - ${foundOrg.fullOrganisationName}` : `${value} - Unknown`
  }

  const originalCode = result.NextResultSourceOrganisation?.OrganisationUnitCode
  const fieldRowValue = getDisplayValue(originalCode)
  const typeaheadValue = amendedNextHearingLocation ? getDisplayValue(amendedNextHearingLocation) : fieldRowValue

  useEffect(() => {
    const fetchInitialOrganisation = async () => {
      const codeToFetch = amendedNextHearingLocation || originalCode
      if (!codeToFetch) {
        return
      }

      try {
        const response = await fetch(`/bichard/api/organisation-units?search=${codeToFetch}`)
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }
        const data = (await response.json()) as OrganisationUnitApiResponse

        setOrganisations((prev) => (prev !== undefined ? prev : data))
      } catch (error) {
        console.error(error)
        setOrganisations((prev) => (prev !== undefined ? prev : []))
      }
    }

    if (organisations === undefined) {
      fetchInitialOrganisation()
    }
  }, [originalCode, amendedNextHearingLocation, organisations])

  return (
    <EditableFieldRow
      className={"next-hearing-location-row"}
      label="Next hearing location"
      hasExceptions={hasNextHearingLocationException(exceptions)}
      value={fieldRowValue}
      updatedValue={amendedNextHearingLocation}
      isEditable={isEditable}
      inputLabel="Enter next hearing location"
      hintText="OU code, 6-7 characters"
      htmlFor={"next-hearing-location"}
    >
      <OrganisationUnitTypeahead
        key={organisations === undefined ? "loading" : "loaded"}
        value={typeaheadValue}
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
