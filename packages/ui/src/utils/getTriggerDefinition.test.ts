import getTriggerDefinition from "./getTriggerDefinition"

describe("getTriggerDefinition", () => {
  it("Should return the trigger definition when trigger code exists", () => {
    const result = getTriggerDefinition("TRPR0001")
    expect(result).toStrictEqual({
      code: "TRPR0001",
      shortDescription: "Disqualified driver",
      description: "Driver Disqualification - Update DD screen.",
      pncScreenToUpdate: "Driver Disqualification",
      cjsResultCode:
        "<ul></li> <li>3028 Disqualification limited to</li><li>3030 Driving license restored with effect from</li><li>3050 Reduced Disqualification from Driving after Completing Course</li><li>3051 Reduced Disqualification from Driving - special reasons or mitigating circumstances</li><li>3070 Disqualified from Driving - Obligatory</li><li>3071 Disqualified from Driving - Discretionary</li><li>3072 Disqualified from Driving - Points (Totting)</li><li>3073 Disqualified from Driving until Ordinary Test Passed</li><li>3074 Disqualified from Driving until Extended Test Passed</li><li>3094 Disqualified from Driving non motoring offence</li><li>3095 Disqualified from Driving - vehicle used in Crime</li><li>3096 Interim Disqualification from Driving</li></ul>"
    })
  })

  it("Should return undefined when trigger code exists", () => {
    const result = getTriggerDefinition("TRPR9999")
    expect(result).toBeUndefined()
  })
})
