import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import AutoSave from "components/EditableFields/AutoSave"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import ErrorMessage from "components/EditableFields/ErrorMessage"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { useState } from "react"
import { Exception } from "types/exceptions"
import getNextHearingDateValue from "utils/amendments/getAmendmentValues/getNextHearingDateValue"
import hasNextHearingDateExceptions from "utils/exceptions/hasNextHearingDateExceptions"
import { formatDisplayedDate, formatFormInputDateString } from "utils/date/formattedDate"
import isValidNextHearingDate from "utils/validators/isValidNextHearingDate"

interface NextHearingDateFieldProps {
  result: Result
  exceptions: Exception[]
  offenceIndex: number
  resultIndex: number
  isCaseEditable: boolean
}

export const NextHearingDateField = ({
  result,
  exceptions,
  offenceIndex,
  resultIndex,
  isCaseEditable
}: NextHearingDateFieldProps) => {
  const { amendments, amend } = useCourtCase()
  const currentUser = useCurrentUser()
  const amendedNextHearingDate = getNextHearingDateValue(amendments, offenceIndex, resultIndex)
  const updatedNextHearingDate = getNextHearingDateValue(amendments, offenceIndex, resultIndex)

  const [isNhdSaved, setIsNhdSaved] = useState<boolean>(false)
  const [nextHearingDateChanged, setNextHearingDateChanged] = useState<boolean>(false)

  const isEditable =
    isCaseEditable && hasNextHearingDateExceptions(exceptions) && currentUser.featureFlags?.exceptionsEnabled

  return (
    <EditableFieldTableRow
      className={"next-hearing-date-row"}
      label="Next hearing date"
      hasExceptions={hasNextHearingDateExceptions(exceptions)}
      value={result.NextHearingDate && formatDisplayedDate(String(result.NextHearingDate))}
      updatedValue={updatedNextHearingDate && formatDisplayedDate(updatedNextHearingDate)}
      isEditable={isEditable}
      inputLabel="Enter next hearing date"
      hintText="Enter date"
    >
      <input
        className="govuk-input"
        id="next-hearing-date"
        type="date"
        min={result.ResultHearingDate && formatFormInputDateString(result.ResultHearingDate)}
        name={"next-hearing-date"}
        value={amendedNextHearingDate}
        onChange={(event) => {
          setNextHearingDateChanged(true)
          setIsNhdSaved(false)
          amend("nextHearingDate")({
            resultIndex: resultIndex,
            offenceIndex: offenceIndex,
            value: event.target.value
          })
        }}
      />
      <AutoSave
        setChanged={setNextHearingDateChanged}
        setSaved={setIsNhdSaved}
        isValid={isValidNextHearingDate(amendedNextHearingDate, result.ResultHearingDate)}
        amendmentFields={["nextHearingDate"]}
        isChanged={nextHearingDateChanged}
        isSaved={isNhdSaved}
      >
        {!isValidNextHearingDate(amendedNextHearingDate, result.ResultHearingDate) && (
          <ErrorMessage message="Select valid Next hearing date" />
        )}
      </AutoSave>
    </EditableFieldTableRow>
  )
}
