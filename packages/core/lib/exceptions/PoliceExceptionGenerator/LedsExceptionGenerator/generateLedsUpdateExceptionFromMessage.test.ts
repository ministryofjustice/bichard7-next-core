import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import generateLedsUpdateExceptionFromMessage from "./generateLedsUpdateExceptionFromMessage"

describe("generateLedsExceptionFromMessage", () => {
  it.each([
    { message: "Invalid personUrn &<pnc_person_id>", expectedCode: ExceptionCode.HO100402 },
    { message: "Incorrect personId", expectedCode: ExceptionCode.HO100402 },
    { message: "Incorrect reportId", expectedCode: ExceptionCode.HO100402 },
    { message: "Invalid owner code", expectedCode: ExceptionCode.HO100402 },
    { message: "Invalid Remand Date &<date>", expectedCode: ExceptionCode.HO100402 },
    { message: "Invalid Appearance Result &<appearance result>", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Invalid combination of <appearance location>, <next appearance location> and <appearance result>",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Invalid Next Appearance Date &<date>", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Either local authority code or local authority name is allowed for Remanded-In-care",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Local authority code or local authority name cannot be provided for appearance result",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Local authority secure unit cannot be provided for appearance result",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Social Worker name cannot be provided for appearance result", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Social Worker telephone fields cannot be provided for appearance result",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Local authority secure unit must be provided with local authority code",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Local authority secure unit can only be either True or False", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Local authority code is mandatory when social worker name is provided",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Local authority code is mandatory when social worker telephone fields are provided",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Invalid local authority code", expectedCode: ExceptionCode.HO100402 },
    { message: "Invalid Social Worker Telephone number fields", expectedCode: ExceptionCode.HO100402 },
    { message: "Remand date cannot be blank", expectedCode: ExceptionCode.HO100402 },
    { message: "Appearance Result cannot be blank", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Maximum character length exceeded & <current appearance CourtName>",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Maximum character length exceeded & <social worker name>", expectedCode: ExceptionCode.HO100402 },
    { message: "Maximum character length exceeded & < local authority name>", expectedCode: ExceptionCode.HO100402 },
    { message: "Maximum sequence number exceeded", expectedCode: ExceptionCode.HO100402 },
    { message: "must be a valid force station code", expectedCode: ExceptionCode.HO100402 },
    { message: "Provided personUrn is not associated with court case", expectedCode: ExceptionCode.HO100402 },
    { message: "must not be null", expectedCode: ExceptionCode.HO100402 },
    { message: "must be a valid court code", expectedCode: ExceptionCode.HO100402 },
    { message: "Court code or Court name must be provided", expectedCode: ExceptionCode.HO100402 },
    { message: "size must be between 1 and 71", expectedCode: ExceptionCode.HO100402 },
    {
      message: "defendantFirstNames must contain at least one value for individual",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "must be less than or equal to 9999", expectedCode: ExceptionCode.HO100402 },
    { message: "All offence(s) in a court case cannot be carried forward", expectedCode: ExceptionCode.HO100402 },
    { message: "must be less than or equal to 999 ", expectedCode: ExceptionCode.HO100402 },
    {
      message: "RoleQualifier must not be present when offence Code is text or CJS",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Role qualifier provided '%s' is not permitted for offence code '%s'",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "LegislationQualifier must not be present when offence Code is text or CJS",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "LegislationQualifier NR is not acceptable", expectedCode: ExceptionCode.HO100402 },
    { message: "Plea is required", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Plea must be empty when disposal action is 'refer to court case' or 'carry forward'",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Adjudication is required", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Adjudication must be empty when disposal action is 'refer to court case' or 'carry forward'",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Date of Sentence must be empty when disposal action is 'refer to court case' or 'carry forward'",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Date of sentence cannot be in the future", expectedCode: ExceptionCode.HO100402 },
    { message: "Date of sentence cannot be before 1592", expectedCode: ExceptionCode.HO100402 },
    { message: "Date of sentence is required", expectedCode: ExceptionCode.HO100402 },
    { message: "Date of sentence cannot be before date of conviction", expectedCode: ExceptionCode.HO100402 },
    { message: "Date of sentence cannot be before the offenceEndDate", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Offence Tic must be set to 0 when disposal action is 'refer to court case' or 'carry forward'",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "must be a valid disposal code", expectedCode: ExceptionCode.HO100402 },
    { message: "Disposal code cannot be : 2057 , 2058, 9999", expectedCode: ExceptionCode.HO100402 },
    { message: "The value provided is not in a valid format", expectedCode: ExceptionCode.HO100402 },
    { message: "Fine amount cannot be null if fine units are provided", expectedCode: ExceptionCode.HO100402 },
    { message: "must match format", expectedCode: ExceptionCode.HO100402 },
    { message: "Please enter a valid qualifier", expectedCode: ExceptionCode.HO100402 },
    { message: "One or more Disposal Qualifiers not in reference data set", expectedCode: ExceptionCode.HO100402 },
    {
      message: "One or more Disposal Qualifiers incompatible with one or more Disposal Qualifiers ",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Duplicate Disposal Qualifiers not allowed", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Qualifier Duration field should not be populated for the selected Qualifier Code",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Disposal text field must be populated for the detected disposal code",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Disposal text field should not be populated for the detected disposal code",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "the value provided is invalid", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Location Address or Location Text must be provided for an additional offence",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Either Location Address or Location Text must be provided for an additional offence, not both",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Offence start date cannot be after the current time", expectedCode: ExceptionCode.HO100402 },
    { message: "Offence start date cannot be after the offence end date", expectedCode: ExceptionCode.HO100402 },
    { message: "Offence start time cannot be after the current time", expectedCode: ExceptionCode.HO100402 },
    { message: "Offence end date cannot be in the future", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Offence Start Date and Time cannot be after Offence End Date and Time",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Offence end time cannot be after the current time", expectedCode: ExceptionCode.HO100402 },
    {
      message: "PNC Person ID of the offence retrieved for update does not match supplied ASN",
      expectedCode: ExceptionCode.HO100401
    },
    {
      message: "Given personUrn(%s) does not belong to the personId: (%s)! , personUrnFromRequest, personUrnFromDb",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "PNC Person ID of offence retrieved for update does not match Person URN supplied",
      expectedCode: ExceptionCode.HO100401
    },
    {
      message: "Provided personUn is not associated with court case. personUrn: {{personUrn}}",
      expectedCode: ExceptionCode.HO100401
    },
    {
      message:
        "Provided courtCaseReference is invalid for the disposalId given. disposalId: courtCaseId courtCaseReference: courtCaseReferenceIncoming",
      expectedCode: ExceptionCode.HO100401
    },
    { message: "must be a valid npcc offence code", expectedCode: ExceptionCode.HO100402 },
    { message: "must be a valid cjs offence code", expectedCode: ExceptionCode.HO100402 },
    {
      message: "offence details provided for offence number: {offenceId} do not exist for the court case!",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Invalid Social Worker Telephone number fields", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Disposal result is not possible for the case: chargeStatusMarker",
      expectedCode: ExceptionCode.HO100401
    },
    { message: "Invalid Carried forward details", expectedCode: ExceptionCode.HO100402 },
    { message: "Invalid Refer to court case details", expectedCode: ExceptionCode.HO100402 },
    { message: "Refer to court case details required", expectedCode: ExceptionCode.HO100402 },
    { message: "cannot be in the future", expectedCode: ExceptionCode.HO100402 },
    { message: "Multiple disposals not allowed for Refer to court case", expectedCode: ExceptionCode.HO100402 },
    { message: "Multiple disposals not allowed for Carried Forward offence", expectedCode: ExceptionCode.HO100402 },
    {
      message:
        "Only 1 disposal result must be provided when disposal action is 'refer to court case' or 'carry forward'",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Only interim Disposal Codes can be used with Sentence Awaited Disposal Codes ",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "No offence record found with the ids: [offenceId1, offenceId2]", expectedCode: ExceptionCode.HO100401 },
    { message: "Invalid Adjudication for Disposal Code", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Disposal duration field should not be populated for the selected Disposal Code",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Disposal date field should not be populated for the selected Disposal Code",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Disposal fine amount field should not be populated for the selected Disposal Code",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Disposal fine units field should not be populated for the selected Disposal Code",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message:
        "Appearance date of carryForward can not be before MIN_APPEARANCE_YEAR appearanceDate : appearanceDateIncoming.List.of(carryForward.appearanceDate)",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message:
        "Appearance date of carryForward must be the same or later than the appearance date on the current disposal. appearanceDate : appearanceDateIncoming.List.of(carryForward.appearanceDate)",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "No forceStation found for the provided ownerCode :ownerCode", expectedCode: ExceptionCode.HO100402 },
    { message: "Given personUrn ( ) does not belong to the personId: ( )", expectedCode: ExceptionCode.HO100402 },
    { message: "Provided court case reference not found", expectedCode: ExceptionCode.HO100402 },
    { message: "court code or court name must be provided", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Appearance date must be same or later than sentence date (disposal date) of original hearing",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "must be less than or equal to 999", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Not valid for subsequent disposal because plea does not match with original disposal",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Plea is required when reason for appearance is 'Subsequently Varied'",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Plea must be empty when reason for appearance is 'Sentence Deferred'",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Adjudication is required when reason for appearance is 'Subsequently Varied'",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Adjudication must be empty when reason for appearance is 'Sentence Deferred'",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Disposal code cannot be : 2057, 2058, 2059, 2060, 9999", expectedCode: ExceptionCode.HO100402 },
    { message: "the value provided is not in a valid format", expectedCode: ExceptionCode.HO100402 },
    { message: "The value provided is invalid", expectedCode: ExceptionCode.HO100402 },
    { message: "must match format \\yyyy-mm-dd\\", expectedCode: ExceptionCode.HO100402 },
    { message: "must be a valid disposal qualifier", expectedCode: ExceptionCode.HO100402 },
    {
      message: "Qualifier Duration field should not be populated for the slected Qualifier code",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Disposal Text should not be populated for the selected Disposal Code",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Offence details provided for offence number <offenceId> do not exist for the court case",
      expectedCode: ExceptionCode.HO100401
    },
    {
      message:
        "No court case has been found with reference id : courtCaseSubsequentDisposalResult.getCourtcaseReference()",
      expectedCode: ExceptionCode.HO100401
    },
    {
      message: "The original disposal code(s) for the offence are not valid for the reason for subsequent appearance",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Status of court case not suitable for reason for Subsequent Disposal",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Status of Offence(s) not suitable for reason for Subsequent Disposal",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Status of court case not suitable for reason for subsequent appearance",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Status of offence(s) not suitable for reason for subsequent appearance",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Not valid for subsequent disposal because no plea was provided on original disposal",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Not valid for subsequent disposal because no adjudication was provided on original disposal",
      expectedCode: ExceptionCode.HO100402
    },
    {
      message: "Not valid for subsequent disposal because no disposal was provided on original disposal",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "Invalid adjudication for Disposal Code", expectedCode: ExceptionCode.HO100402 },
    { message: "Disposal code cannot be : 2057, 2058, 2059, 2060, 9999", expectedCode: ExceptionCode.HO100402 },
    { message: "The court case already has a subsequent appearance ", expectedCode: ExceptionCode.HO100402 },
    {
      message:
        "Additional offence(s) must be added to the court case because at least one offence has been referred to a new court case",
      expectedCode: ExceptionCode.HO100402
    },
    { message: "dummy message", expectedCode: ExceptionCode.HO100402 },
    { message: "", expectedCode: ExceptionCode.HO100402 }
  ])('should return exception $expectedCode when message is "$message"', ({ message, expectedCode }) => {
    const expectedPath = [
      "AnnotatedHearingOutcome",
      "HearingOutcome",
      "Case",
      "HearingDefendant",
      "ArrestSummonsNumber"
    ]

    const exception = generateLedsUpdateExceptionFromMessage(message)
    const exceptionForLowercaseMessage = generateLedsUpdateExceptionFromMessage(message.toLowerCase())
    const exceptionForUppercaseMessage = generateLedsUpdateExceptionFromMessage(message.toUpperCase())

    expect(exception).toEqual({
      code: expectedCode,
      message,
      path: expectedPath
    })
    expect(exceptionForLowercaseMessage).toEqual({
      code: expectedCode,
      message: message.toLowerCase(),
      path: expectedPath
    })
    expect(exceptionForUppercaseMessage).toEqual({
      code: expectedCode,
      message: message.toUpperCase(),
      path: expectedPath
    })
  })
})
