import generateAho from "../../../../test/helpers/generateAho"

describe("reports API endpoint", () => {
  describe("GET /reports/*", () => {
    beforeEach(() => {
      cy.loginAs("GeneralHandler")
    })

    it("returns a 404 if unknown report-type", () => {
      cy.request({
        method: "GET",
        url: `/bichard/api/reports/not-a-report`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(404)
      })
    })
  })
})

describe("GET /reports/resolved-exceptions", () => {
  beforeEach(() => {
    cy.readFile("test/test-data/AnnotatedHOTemplate.xml").then((ahoXml) => {
      const aho = generateAho({
        firstName: "first-name",
        lastName: "last-name",
        ahoTemplate: ahoXml,
        ptiurn: "ptirun",
        courtName: "court-name"
      })
      cy.loginAs("GeneralHandler")
      cy.task("insertCourtCasesWithFields", [
        {
          orgForPoliceFilter: "01",
          hearingOutcome: aho,
          updatedHearingOutcome: aho,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorStatus: "Resolved",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          errorReason: "HO100321",
          errorResolvedBy: "GeneralHandler",
          defendantName: "WAYNE Bruce",
          resolutionTimestamp: "2024-10-07 10:51:23",
          messageReceivedTimestamp: "2024-10-07 10:51:23"
        },
        {
          orgForPoliceFilter: "01",
          hearingOutcome: aho,
          updatedHearingOutcome: aho,
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          errorReason: "HO100321",
          defendantName: "GORDON Barbara"
        }
      ])
    })
  })

  it("returns a 400 if resolved dates not included in query string", () => {
    cy.request({
      method: "GET",
      url: `/bichard/api/reports/resolved-exceptions`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(400)
    })
  })

  it("returns a csv payload", () => {
    cy.request({
      method: "GET",
      url: `/bichard/api/reports/resolved-exceptions?resolvedFrom=2024-10-01%2000:00:00&resolvedTo=2024-10-10%2022:59:59`
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.report).to.equal(
        `ASN,PTIURN,Defendant Name,Court Name,Hearing Date,Case Reference,Date/Time Received By CJSE,Date/Time Resolved,Notes,Resolution Action\n0836FP0100000377244A,Case00000,WAYNE Bruce,Magistrates' Courts Essex Basildon,2011-09-26T00:00:00.000Z,97/1626/008395Q,2024-10-07T09:51:23.000Z,2024-10-07T09:51:23.000Z,[],`
      )
    })
  })
})
