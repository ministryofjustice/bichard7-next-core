import { NavLink } from "types/NavLinks"
import { isNavLinkForCurrentRoute } from "./isNavLinkForCurrentRoute"
import { createMockRouter } from "../../../test/helpers/createMockRouter"

describe("navigation links", () => {
  it("should return false for non-case list nav link", () => {
    expect(isNavLinkForCurrentRoute(createMockRouter({ pathname: "/bichard/audit/" }), NavLink.CaseList)).toBeFalsy()
    expect(
      isNavLinkForCurrentRoute(
        createMockRouter({
          pathname: "/bichard/court-cases/{0}",
          query: { previousPath: "/bichard/audit/1234" }
        }),
        NavLink.CaseList
      )
    ).toBeFalsy()
  })

  it("should return true for the case list nav link", () => {
    expect(isNavLinkForCurrentRoute(createMockRouter({ pathname: "/" }), NavLink.CaseList)).toBeTruthy()
    expect(isNavLinkForCurrentRoute(createMockRouter({ pathname: "/court-cases/{0}" }), NavLink.CaseList)).toBeTruthy()
  })

  it("should return false for non-audit page audit link", () => {
    expect(isNavLinkForCurrentRoute(createMockRouter({ pathname: "/bichard/" }), NavLink.Audit)).toBeFalsy()
  })

  it("should return true for audit page audit link", () => {
    expect(isNavLinkForCurrentRoute(createMockRouter({ pathname: "/bichard/audit/" }), NavLink.Audit)).toBeTruthy()
  })

  it("should return true for case list previous url querystring audit link", () => {
    expect(
      isNavLinkForCurrentRoute(
        createMockRouter({
          pathname: "/bichard/court-cases/{0}",
          query: { previousPath: "/bichard/audit/1234" }
        }),
        NavLink.Audit
      )
    ).toBeTruthy()
  })

  it("should return false for non-case list report nav link", () => {
    expect(isNavLinkForCurrentRoute(createMockRouter({ pathname: "/bichard/" }), NavLink.Reports)).toBeFalsy()
  })
})
