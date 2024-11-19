import { Result } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import AutoSave from "components/EditableFields/AutoSave"
import EditableFieldTableRow from "components/EditableFields/EditableFieldTableRow"
import ErrorMessage from "components/EditableFields/ErrorMessage"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { useState } from "react"
import { Exception } from "types/exceptions"
import getNextHearingDateValue from "utils/amendments/getAmendmentValues/getNextHearingDateValue"
import { formatDisplayedDate, formatFormInputDateString } from "utils/date/formattedDate"
import hasNextHearingDateExceptions from "utils/exceptions/hasNextHearingDateExceptions"
import isValidNextHearingDate from "utils/validators/isValidNextHearingDate"

interface NextHearingDateFieldProps {
  exceptions: Exception[]
  isCaseEditable: boolean
  offenceIndex: number
  result: Result
  resultIndex: number
}

export const NextHearingDateField = ({
  exceptions,
  isCaseEditable,
  offenceIndex,
  result,
  resultIndex
}: NextHearingDateFieldProps) => {
  const { amend, amendments } = useCourtCase()
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
      hasExceptions={hasNextHearingDateExceptions(exceptions)}
      hintText="Enter date"
      inputLabel="Enter next hearing date"
      isEditable={isEditable}
      label="Next hearing date"
      updatedValue={updatedNextHearingDate && formatDisplayedDate(updatedNextHearingDate)}
      value={result.NextHearingDate && formatDisplayedDate(String(result.NextHearingDate))}
    >
      <input
        className="govuk-input"
        id="next-hearing-date"
        min={result.ResultHearingDate && formatFormInputDateString(result.ResultHearingDate)}
        name={"next-hearing-date"}
        onChange={(event) => {
          setNextHearingDateChanged(true)
          setIsNhdSaved(false)
          amend("nextHearingDate")({
            offenceIndex: offenceIndex,
            resultIndex: resultIndex,
            value: event.target.value
          })
        }}
        type="date"
        value={amendedNextHearingDate}
      />
      <AutoSave
        amendmentFields={["nextHearingDate"]}
        isChanged={nextHearingDateChanged}
        isSaved={isNhdSaved}
        isValid={isValidNextHearingDate(amendedNextHearingDate, result.ResultHearingDate)}
        setChanged={setNextHearingDateChanged}
        setSaved={setIsNhdSaved}
      >
        {!isValidNextHearingDate(amendedNextHearingDate, result.ResultHearingDate) && (
          <ErrorMessage message="Select valid Next hearing date" />
        )}
      </AutoSave>
    </EditableFieldTableRow>
  )
}
