import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { DisplayFullCourtCase } from "./display/CourtCases"
import { Exception } from "./exceptions"

enum ErrorMessages {
  QualifierCode = "This code could not be recognised, contact the courts to verify the correct information and report to the Bichard 7 team. Resolve exception by manually updating the PNC with correct code.",
  HO100251ErrorPrompt = "This code is not valid, contact the courts to correct offence code.",
  HO100306ErrorPrompt = "This code could not be recognised. If this is a new offence code update the PNC and mark the case as manually resolved. Otherwise if this offence code is incorrect contact the courts to correct it.",
  HO200113 = "The PNC cannot be updated automatically because there are new remands together with sentencing. Please resolve this exception by manually updating the PNC with correct code.",
  HO200114 = "The PNC cannot be updated automatically because there are changes to existing disposals together with sentencing. Please resolve this exception by manually updating the PNC with correct code.",
  HO100203 = "Go back to old Bichard, fix it and resubmit. Bad Court Case Reference Number format",
  HO100228 = "Go back to old Bichard, fix it and resubmit. Manual sequence number is invalid (i.e. it is not a number)",
  HO100307 = "This code could not be found via look-up, report the issue to Bichard 7 team and the courts for the correct so that they can investigate this issue and advise.",
  HO100304 = "If offences appear to match, then check if offence dates match also. After this manually resolve on the PNC, to deal with error, and then manually resolved in Bichard.",
  HO100311 = "Duplicate court Offence Sequence Number",
  HO100312 = "Go back to old Bichard, fix it and resubmit. Manual sequence number does not match the sequence number of any PNC offence",
  HO100320 = "Go back to old Bichard, fix it and resubmit. Manual sequence number identifies an offence that matches a PNC offence but doesn't match a court offence (i.e. the offence code or dates do not match correctly",
  HO100328 = "Court offences match both a CCR and a PCR. This needs to be manually resolved on the PNC to deal with error, and then manually resolved in Bichard.",
  HO100333 = "Go back to old Bichard, fix it and resubmit. Manual match detected but no case matches upon resubmission, suggesting ASN updated or PNC data updated manually before resubmission.",
  HO100507 = "Offences have been added in court to a Penalty case. This needs to be manually resolved on the PNC to deal with error, and then manually resolved in Bichard."
}

const findExceptions = (
  courtCase: DisplayFullCourtCase,
  ahoExceptions: Exception[],
  ...exceptions: ExceptionCode[]
) => {
  if (courtCase.errorStatus === "Resolved") {
    return undefined
  }

  const exception = ahoExceptions.find(({ code }) => exceptions.includes(code))

  return exception ? ErrorMessages[exception.code as keyof typeof ErrorMessages] : undefined
}

export default ErrorMessages
export { findExceptions }
