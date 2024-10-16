import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { BadgeColours } from "components/Badge"
import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"
import ErrorPromptMessage from "../../src/components/ErrorPromptMessage"
import ExceptionFieldTableRow from "../../src/components/ExceptionFieldTableRow"
import ErrorMessage from "../../src/types/ErrorMessages"

describe("Uneditable Fields", () => {
  ;[
    {
      title: "Disposal Qualifier",
      label: "Code",
      exception: ExceptionCode.HO100309,
      badge: ExceptionBadgeType.SystemError,
      message: ErrorMessage.QualifierCode,
      value: "XX"
    },
    {
      title: "ASN",
      label: "ASN",
      exception: ExceptionCode.HO200113,
      badge: ExceptionBadgeType.SystemError,
      message: ErrorMessage.HO200113,
      value: "2300000000000942133G"
    },
    {
      title: "ASN",
      label: "ASN",
      exception: ExceptionCode.HO200114,
      badge: ExceptionBadgeType.SystemError,
      message: ErrorMessage.HO200114,
      value: "2200000000001145631B"
    },
    {
      title: "CJS Code",
      label: "Code",
      exception: ExceptionCode.HO100307,
      badge: ExceptionBadgeType.SystemError,
      message: ErrorMessage.HO100307,
      value: "BadCJSCode"
    }
  ].forEach(({ title, exception, badge, message, value, label }) => {
    it(`should show an error prompt for exception ${exception} (${title})`, () => {
      cy.mount(
        <ExceptionFieldTableRow badgeText={badge} value={value} label={label} badgeColour={BadgeColours.Purple}>
          <ErrorPromptMessage message={message} />
        </ExceptionFieldTableRow>
      )
      cy.get(".field-value").should("have.text", value)
      cy.get(".error-badge").should("have.text", badge)
      cy.get(".error-prompt").should("have.text", message)
    })
  })
})
