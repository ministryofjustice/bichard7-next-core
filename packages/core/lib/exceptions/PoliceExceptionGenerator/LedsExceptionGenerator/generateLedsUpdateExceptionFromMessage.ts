import type { PncException } from "@moj-bichard7/common/types/Exception"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"

const defaultUpdateException = ExceptionCode.HO100402

const exceptions: { [key in ExceptionCode]?: RegExp[] } = {
  [ExceptionCode.HO100402]: [
    /Invalid personUrn/i,
    /Incorrect personId/i,
    /Incorrect reportId/i,
    /Invalid owner code/i,
    /Invalid Remand Date/i,
    /Invalid Appearance Result/i,
    /Invalid combination of/i,
    /Invalid Next Appearance Date/i,
    /Either local authority code or local authority name is allowed for Remanded-In-care/i,
    /Local authority code or local authority name cannot be provided for appearance result/i,
    /Local authority secure unit cannot be provided for appearance result/i,
    /Social Worker name cannot be provided for appearance result/i,
    /Social Worker telephone fields cannot be provided for appearance result/i,
    /Local authority secure unit must be provided with local authority code/i,
    /Local authority secure unit can only be either True or False/i,
    /Local authority code is mandatory when social worker name is provided/i,
    /Local authority code is mandatory when social worker telephone fields are provided/i,
    /Invalid local authority code/i,
    /Invalid Social Worker Telephone number fields/i,
    /must be a valid force station code/i,
    /Provided personUrn is not associated with court case/i,
    /must not be null/i,
    /must be a valid court code/i,
    /Court code or Court name must be provided/i,
    /size must be between 1 and 71/i,
    /defendantFirstNames must contain at least one value for individual/i,
    /All offence(s) in a court case cannot be carried forward/i,
    /RoleQualifier must not be present when offence Code is text or CJS/i,
    /Role qualifier provided '%s' is not permitted for offence code/i,
    /LegislationQualifier must not be present when offence Code is text or CJS/i,
    /LegislationQualifier .* is not acceptable/i,
    /Plea is required/i,
    /Plea must be empty/i,
    /Adjudication is required/i,
    /Adjudication must be empty/i,
    /Date of Sentence must be empty/i,
    /Date of sentence cannot be/i,
    /Date of sentence is required/i,
    /Offence Tic must be set to 0/i,
    /must be a valid disposal code/i,
    /Disposal code cannot be/i,
    /The value provided is not in a valid format/i,
    /Fine amount cannot be null/i,
    /must match format/i,
    /enter a valid qualifier/i,
    /One or more Disposal Qualifiers not in reference data set/i,
    /One or more Disposal Qualifiers incompatible with one or more Disposal Qualifiers/i,
    /Duplicate Disposal Qualifiers not allowed/i,
    /Qualifier Duration field should not be populated for the selected Qualifier Code/i,
    /Disposal text field must be populated/i,
    /Disposal text field should not be populated/i,
    /the value provided is invalid/i,
    /Location Address or Location Text must be provided for an additional offence/i,
    /Offence start date cannot be/i,
    /Offence start time cannot be/i,
    /Offence end date cannot/i,
    /Offence Start Date and Time cannot be/i,
    /Offence end time cannot be/i,
    /No forceStation found for the provided ownerCode/i,
    /Given personUrn .* does not belong to the personId/i,
    /Provided court case reference not found/i,
    /Appearance date must be same or later than sentence date/i,
    /must be less than or equal to 999/i,
    /Not valid for subsequent disposal because plea does not match with original disposal/i,
    /must be a valid disposal qualifier/i,
    /Disposal Text should not be populated/i,
    /Remand date cannot be blank/i,
    /Appearance Result cannot be blank/i,
    /Maximum character length exceeded/i,
    /Maximum sequence number exceeded/i,
    /Invalid Refer to court case details/i,
    /Refer to court case details required/i,
    /must be a valid npcc offence code/i,
    /must be a valid cjs offence code/i,
    /Invalid Carried forward details/i,
    /cannot be in the future/i,
    /Multiple disposals not allowed/i,
    /Only 1 disposal result must be provided/i,
    /Only interim Disposal Codes can be used with Sentence Awaited Disposal Codes /i,
    /Invalid Adjudication for Disposal Code/i,
    /Disposal duration field should not be populated for the selected Disposal Code/i,
    /Disposal date field should not be populated/i,
    /Disposal fine amount field should not be populated/i,
    /Disposal fine units field should not be populated/i,
    /Appearance date of carryForward can not be before/i,
    /Appearance date of carryForward must be the same or later than the appearance date on the current disposal/i,
    /Additional offence(s) must be added to the court case because at least one offence has been referred to a new court case/i,
    /must match ".*"/i,
    /The original disposal code(s) for the offence are not valid for the reason for subsequent appearance/i,
    /Status of court case not suitable for reason for Subsequent .*/i,
    /Status of Offence(s) not suitable for reason for Subsequent .*/i,
    /Not valid for subsequent disposal because no/i,
    /The court case already has a subsequent appearance /i
  ],

  [ExceptionCode.HO100401]: [
    /PNC Person ID of the offence retrieved for update does not match supplied ASN/i,
    /Given personUrn .* does not belong to the personId/i,
    /PNC Person ID of offence retrieved for update does not match Person URN supplied/i,
    /Offence details provided for offence number .* do not exist for the court case/i,
    /Provided personUn is not associated with court case/i,
    /Provided courtCaseReference is invalid for the disposalId given/i,
    /No court case has been found with reference id/i,
    /Disposal result is not possible for the case/i,
    /No offence record found with the ids/i
  ]
}

const exceptionEntries = Object.entries(exceptions) as [ExceptionCode, RegExp[]][]

const generateLedsUpdateExceptionFromMessage = (message: string): PncException => {
  const exceptionCode =
    exceptionEntries.find(([, patterns]) => patterns.some((pattern) => pattern.test(message)))?.[0] ??
    defaultUpdateException

  return { code: exceptionCode, path: errorPaths.case.asn, message }
}

export default generateLedsUpdateExceptionFromMessage
