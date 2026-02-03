import { NavLink } from "types/NavLinks"
import { isNavLinkForPath } from "./isNavLinkForPath"

describe("navigation links", () => {
  beforeEach(() => {
    jest.mock("")
  })

  it("should return false for non-case list nav link", () => {
    expect(isNavLinkForPath("/bichard/audit/", NavLink.CaseList)).toBeFalsy()
    expect(isNavLinkForPath("/bichard/court-cases/{0}?previousPath=/audit/1234", NavLink.CaseList)).toBeFalsy()
  })

  it("should return true for the case list nav link", () => {
    expect(isNavLinkForPath("/", NavLink.CaseList)).toBeTruthy()
    expect(isNavLinkForPath("/?order=desc&orderBy=courtDate", NavLink.CaseList)).toBeTruthy()
    expect(isNavLinkForPath("/court-cases/{0}", NavLink.CaseList)).toBeTruthy()
    expect(isNavLinkForPath("/court-cases/?order=desc&orderBy=courtDate", NavLink.CaseList)).toBeTruthy()
  })

  it("should return false for non-audit page audit link", () => {
    expect(isNavLinkForPath("/bichard/", NavLink.Audit)).toBeFalsy()
  })

  it("should return true for audit page audit link", () => {
    expect(isNavLinkForPath("/bichard/audit/", NavLink.Audit)).toBeTruthy()
  })

  it("should return true for case list previous url querystring audit link", () => {
    expect(isNavLinkForPath("/bichard/court-cases/{0}?previousPath=/audit/1234", NavLink.Audit)).toBeTruthy()
  })

  it("should return false for non-case list report nav link", () => {
    expect(isNavLinkForPath("/bichard/", NavLink.Reports)).toBeFalsy()
  })
})
