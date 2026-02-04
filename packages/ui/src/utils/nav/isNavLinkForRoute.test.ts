import { NavLink } from "types/NavLinks"
import { isNavLinkForRoute } from "./isNavLinkForRoute"
import type { NextRouter } from "next/router"

describe("navigation links", () => {
  it("should return false for non-case list nav link", () => {
    expect(isNavLinkForRoute(mockRouter({ pathname: "/bichard/audit/" }), NavLink.CaseList)).toBeFalsy()
    expect(
      isNavLinkForRoute(
        mockRouter({
          pathname: "/bichard/court-cases/{0}",
          query: { previousPath: "/bichard/audit/1234" }
        }),
        NavLink.CaseList
      )
    ).toBeFalsy()
  })

  it("should return true for the case list nav link", () => {
    expect(isNavLinkForRoute(mockRouter({ pathname: "/" }), NavLink.CaseList)).toBeTruthy()
    expect(isNavLinkForRoute(mockRouter({ pathname: "/?order=desc&orderBy=courtDate" }), NavLink.CaseList)).toBeTruthy()
    expect(isNavLinkForRoute(mockRouter({ pathname: "/court-cases/{0}" }), NavLink.CaseList)).toBeTruthy()
    expect(
      isNavLinkForRoute(mockRouter({ pathname: "/court-cases/?order=desc&orderBy=courtDate" }), NavLink.CaseList)
    ).toBeTruthy()
  })

  it("should return false for non-audit page audit link", () => {
    expect(isNavLinkForRoute(mockRouter({ pathname: "/bichard/" }), NavLink.Audit)).toBeFalsy()
  })

  it("should return true for audit page audit link", () => {
    expect(isNavLinkForRoute(mockRouter({ pathname: "/bichard/audit/" }), NavLink.Audit)).toBeTruthy()
  })

  it("should return true for case list previous url querystring audit link", () => {
    expect(
      isNavLinkForRoute(
        mockRouter({
          pathname: "/bichard/court-cases/{0}",
          query: { previousPath: "/bichard/audit/1234" }
        }),
        NavLink.Audit
      )
    ).toBeTruthy()
  })

  it("should return false for non-case list report nav link", () => {
    expect(isNavLinkForRoute(mockRouter({ pathname: "/bichard/" }), NavLink.Reports)).toBeFalsy()
  })
})

function mockRouter(overrides: Partial<NextRouter> = {}): NextRouter {
  return {
    basePath: "",
    pathname: "/",
    route: "/",
    query: {},
    asPath: "/",
    push: jest.fn().mockResolvedValue(true),
    replace: jest.fn().mockResolvedValue(true),
    reload: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    ...overrides
  }
}
