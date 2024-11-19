import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import PncException from "../../src/components/Exception/PncException"

describe("PncException", () => {
  ;[
    {
      code: ExceptionCode.HO100402,
      expectedHeading: "HO100402 - PNC Update Error",
      expectedMessage: "Check the offence matching",
      message:
        "I1008 - GWAY - ENQUIRY ERROR INVALID ADJUDICATION: PNCID: 1996/513346V TAC= 1320991 FN= 73 MN= 698745 SY= LIVE3 IN= 0",
      title: "Invalid adjudication"
    },
    {
      code: ExceptionCode.HO100402,
      expectedHeading: "HO100402 - PNC Update Error",
      expectedMessage: "Create DH page on PNC, then Submit the case on Bichard 7",
      message: "I1008 - GWAY - ENQUIRY ERROR NO SUITABLE DISPOSAL GROUPS 20/01JP/01/5151Y",
      title: "No suitable disposal groups"
    },
    {
      code: ExceptionCode.HO100402,
      expectedHeading: "HO100402 - PNC Update Error",
      expectedMessage: "Enquiry error more than 3 disposal groups",
      message: "I1008 - GWAY - ENQUIRY ERROR MORE THAN 3 DISPOSAL GROUPS 20/0000/00/544160F",
      title: "More than 3 disposal groups"
    },
    {
      code: ExceptionCode.HO100402,
      expectedHeading: "HO100402 - PNC Update Error",
      expectedMessage: "Check PNC record and re-submit",
      message:
        "I1008 - GWAY - ENQUIRY ERROR RECORD CORRUPTION: INCORRECT CHARGE COUNT ON COURT CASE: 21/1013/14991Q PNCID: 2012/245249G TAC= 1338133 FN= 73 MN= 709257 SY= LIVE3 IN= 0",
      title: "Incorrect charge count on court case"
    },
    {
      code: ExceptionCode.HO100402,
      expectedHeading: "HO100402 - PNC Update Error",
      expectedMessage: "Check PNC record and re-submit",
      message:
        "I1008 - GWAY - ENQUIRY ERROR TOO MANY DISPOSALS ( 11 ) CHARGE ISN: 80499810 PNCID: 2016/436145N TAC= 1387491 FN= 73 MN= 738536 SY= LIVE3 IN= 0",
      title: "Too many disposals"
    },
    {
      code: ExceptionCode.HO100402,
      expectedHeading: "HO100402 - PNC Update Error",
      expectedMessage: "Re-submit case to the PNC",
      message:
        "I1036 - Error encountered processing enquiry - Please contact PNC service desk Ref:Date/Time=20210421/173236 Job=24462130 Program=NATSIGN User=73000001 Terminal=A7300001",
      title: "Error encountered processing enquiry"
    },
    {
      code: ExceptionCode.HO100402,
      expectedHeading: "HO100402 - PNC Update Error",
      title: "Without message"
    },
    {
      code: ExceptionCode.HO100404,
      expectedHeading: "HO100404 - PNC Update Error",
      title: "Without message"
    },
    {
      code: ExceptionCode.HO100404,
      expectedHeading: "HO100404 - PNC Update Error",
      expectedMessage: "Re-submit case to the PNC",
      message: "Unexpected PNC communication error",
      title: "With message"
    },
    {
      code: ExceptionCode.HO100302,
      expectedHeading: "HO100302 - PNC Query Error",
      title: "Without message"
    },
    {
      code: ExceptionCode.HO100302,
      expectedHeading: "HO100302 - PNC Query Error",
      expectedMessage: "PNC Query failed 1",
      message: "PNC Query failed 1",
      title: "With message"
    },
    {
      code: ExceptionCode.HO100314,
      expectedHeading: "HO100314 - PNC Query Error",
      title: "Without message"
    },
    {
      code: ExceptionCode.HO100314,
      expectedHeading: "HO100314 - PNC Query Error",
      expectedMessage: "PNC Query failed 2",
      message: "PNC Query failed 2",
      title: "With message"
    }
  ].forEach(({ code, expectedHeading, expectedMessage, message, title }) => {
    it(`should show the PNC error code and message for exception ${code}${title ? ` (${title})` : ""}`, () => {
      cy.mount(<PncException code={code} message={message} />)

      cy.get(".exception-row__details").should("have.text", expectedHeading)
      cy.get(".moj-badge").should("have.text", "PNC Error")
      if (message) {
        cy.get(".govuk-accordion__section").should("exist")
        cy.get(".accordion__content").should("not.exist")
        cy.get(".govuk-accordion__section-button").should("have.text", "PNC error message").click()
        cy.get(".accordion__content").should("exist")
        cy.get(".accordion__content .b7-inset-text__heading").should("have.text", "PNC error message")
        cy.get(".accordion__content .b7-inset-text__content").should("have.text", expectedMessage)
        cy.get(".govuk-accordion__section-button").should("have.text", "PNC error message").click()
        cy.get(".accordion__content").should("not.exist")
      } else {
        cy.get(".govuk-accordion__section").should("not.exist")
      }
    })
  })
})
