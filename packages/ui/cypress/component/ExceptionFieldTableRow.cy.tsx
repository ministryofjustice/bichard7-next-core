import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { BadgeColours } from "components/Badge"
import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"

import ErrorPromptMessage from "../../src/components/ErrorPromptMessage"
import ExceptionFieldTableRow from "../../src/components/ExceptionFieldTableRow"
import ErrorMessage from "../../src/types/ErrorMessages"

describe("Uneditable Fields", () => {
  ;[
    {
      badge: ExceptionBadgeType.SystemError,
      exception: ExceptionCode.HO100309,
      label: "Code",
      message: ErrorMessage.QualifierCode,
      title: "Disposal Qualifier",
      value: "XX"
    },
    {
      badge: ExceptionBadgeType.SystemError,
      exception: ExceptionCode.HO200113,
      label: "ASN",
      message: ErrorMessage.HO200113,
      title: "ASN",
      value: "2300000000000942133G"
    },
    {
      badge: ExceptionBadgeType.SystemError,
      exception: ExceptionCode.HO200114,
      label: "ASN",
      message: ErrorMessage.HO200114,
      title: "ASN",
      value: "2200000000001145631B"
    },
    {
      badge: ExceptionBadgeType.SystemError,
      exception: ExceptionCode.HO100307,
      label: "Code",
      message: ErrorMessage.HO100307,
      title: "CJS Code",
      value: "BadCJSCode"
    }
  ].forEach(({ badge, exception, label, message, title, value }) => {
    it(`should show an error prompt for exception ${exception} (${title})`, () => {
      cy.mount(
        <ExceptionFieldTableRow badgeColour={BadgeColours.Purple} badgeText={badge} label={label} value={value}>
          <ErrorPromptMessage message={message} />
        </ExceptionFieldTableRow>
      )
      cy.get(".field-value").should("have.text", value)
      cy.get(".error-badge").should("have.text", badge)
      cy.get(".error-prompt").should("have.text", message)
    })
  })
})
