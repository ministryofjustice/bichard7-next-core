import generateAho from "../../../../test/helpers/generateAho"

describe("reports API endpoint", () => {
  describe("GET /reports/*", () => {
    beforeEach(() => {
      cy.loginAs("GeneralHandler")
    })

    it("returns a 404 if unknown report-type", () => {
      cy.request({
        failOnStatusCode: false,
        method: "GET",
        url: `/bichard/api/reports/not-a-report`
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
        ahoTemplate: ahoXml,
        courtName: "court-name",
        firstName: "first-name",
        lastName: "last-name",
        ptiurn: "ptirun"
      })
      cy.loginAs("GeneralHandler")
      cy.task("insertCourtCasesWithFields", [
        {
          defendantName: "WAYNE Bruce",
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorReason: "HO100321",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          errorResolvedBy: "GeneralHandler",
          errorStatus: "Resolved",
          hearingOutcome: aho,
          messageReceivedTimestamp: "2024-10-07 10:51:23",
          orgForPoliceFilter: "01",
          resolutionTimestamp: "2024-10-07 10:51:23",
          updatedHearingOutcome: aho
        },
        {
          defendantName: "GORDON Barbara",
          errorCount: 1,
          errorLockedByUsername: "GeneralHandler",
          errorReason: "HO100321",
          errorReport: "HO100321||ds:ArrestSummonsNumber",
          hearingOutcome: aho,
          orgForPoliceFilter: "01",
          updatedHearingOutcome: aho
        }
      ])
    })
  })

  it("returns a 400 if resolved dates not included in query string", () => {
    cy.request({
      failOnStatusCode: false,
      method: "GET",
      url: `/bichard/api/reports/resolved-exceptions`
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
