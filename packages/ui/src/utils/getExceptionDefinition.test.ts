import getExceptionDefinition from "./getExceptionDefinition"

describe("getExceptionDefinition", () => {
  it("Should return the exception definition when exception code exists", () => {
    const result = getExceptionDefinition("HO100301")
    expect(result).toStrictEqual({
      code: "HO100301",
      shortDescription: "ASN not found on PNC",
      description:
        "This error occurs if the result from the court contains an ASN which appears to be in a valid format, for an offence that is recordable but where the ASN does not exist on the PNC.",
      cause:
        "This error occurs when the ASN has passed all formatting checks and therefore looks like a valid ASN. This could occur through a typographic mistake but this is highly unlikely due to the fact that the ASN incorporates a check character at the end to avoid precisely this situation from occurring. Possible causes are:<ul><li>The case has been created on the Police Case Preparation system but transmission to the PNC has failed (this is a known problem in NSPIS).</li><li>For some reason (usually bailed to returns) a new ASN is created on the police system which is sent to Libra but not to PNC.</li><li>Police business process whereby the ASN is not sent to PNC until after the result is received.</li></ul>{:/} A report exists that enables NSPIS forces to identify such situations and the use of this report should minimise such occurrences. However, we have also been informed that for a small proportion of cases the report states that PNC has been updated when in fact it has not. This means that for NSPIS areas there remains a residual number of cases that will arrive at Bichard 7 but for which there is no case actually on PNC.",
      correctingThisError:
        "There is no alternative but for a PNC user to create the case on PNC. The result can then either be resubmitted from the portal or directly resulted on PNC. The latter may be easier as the user will already be on PNC to create the case.",
      avoidingThisError:
        "Police staff in Case Prep teams should ensure that the case is entered onto PNC as well as passing it on to Libra."
    })
  })

  it("Should return undefined when exception code exists", () => {
    const result = getExceptionDefinition("HO900900")
    expect(result).toBeUndefined()
  })
})
