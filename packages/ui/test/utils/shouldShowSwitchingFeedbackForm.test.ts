import { addHours, addMinutes } from "date-fns"
import { SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS } from "../../src/config"
import shouldShowSwitchingFeedbackForm from "../../src/utils/shouldShowSwitchingFeedbackForm"

describe("shouldShowSwitchingFeedbackForm", () => {
  it("should return false when last submission was less than 3 hours ago", () => {
    const lessThan3HoursAgo = addMinutes(addHours(new Date(), -SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS), 10)

    const result = shouldShowSwitchingFeedbackForm(lessThan3HoursAgo)

    expect(result).toBe(false)
  })

  it("should return true when last submission was more than 3 hours ago", () => {
    const moreThan3HoursAgo = addMinutes(addHours(new Date(), -SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS), -10)

    const result = shouldShowSwitchingFeedbackForm(moreThan3HoursAgo)

    expect(result).toBe(true)
  })
  it("should return true when last submission does not have value", () => {
    const result = shouldShowSwitchingFeedbackForm(undefined)

    expect(result).toBe(true)
  })
})
