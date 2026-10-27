import type User from "../../services/entities/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { canSeeCommunitySentenceReport } from "./canSeeCommunitySentenceReport"

describe("canSeeCommunitySentenceReport", () => {
  it("returns false when user does not have feature flag enabled", () => {
    const user = {
      groups: [UserGroup.Supervisor],
      featureFlags: { communitySentenceReportEnabled: false }
    } as unknown as User

    expect(canSeeCommunitySentenceReport(user)).toBe(false)
  })

  it("returns false when user groups does not include Supervisor", () => {
    const user = {
      groups: [UserGroup.GeneralHandler],
      featureFlags: { communitySentenceReportEnabled: true }
    } as unknown as User

    expect(canSeeCommunitySentenceReport(user)).toBe(false)
  })

  it("returns true when user groups includes Supervisor and feature flag is set to true", () => {
    const user = {
      groups: [UserGroup.Supervisor],
      featureFlags: { communitySentenceReportEnabled: true }
    } as unknown as User

    expect(canSeeCommunitySentenceReport(user)).toBe(true)
  })
})
