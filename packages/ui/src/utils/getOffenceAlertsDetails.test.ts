import { Amendments } from "types/Amendments"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import getOffenceAlertsDetails, { exceptionsResolvedFn } from "./getOffenceAlertsDetails"
import createDummyAho from "../../test/helpers/createDummyAho"
import { HO100102, HO100200, HO100322 } from "../../test/helpers/exceptions"
import { DisplayFullCourtCase } from "types/display/CourtCases"

const nextHearingDateException = {
  code: ExceptionCode.HO100102,
  path: [
    "AnnotatedHearingOutcome",
    "HearingOutcome",
    "Case",
    "HearingDefendant",
    "Offence",
    0,
    "Result",
    0,
    "NextHearingDate"
  ]
}

const nextHearingLocationException = {
  code: ExceptionCode.HO100322,
  path: [
    "AnnotatedHearingOutcome",
    "HearingOutcome",
    "Case",
    "HearingDefendant",
    "Offence",
    1,
    "Result",
    0,
    "NextResultSourceOrganisation",
    "OrganisationUnitCode"
  ]
}

describe("exceptionsResolvedFn", () => {
  it("Should return true when relevant exception is resolved", () => {
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 1,
          offenceIndex: 1,
          value: "B21XA00"
        }
      ],
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2024-03-30"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = exceptionsResolvedFn(
      "nextHearingDate",
      updatedFields,
      nextHearingDateException,
      updatedFields.nextHearingDate![0].offenceIndex,
      updatedFields.nextHearingDate![0].resultIndex
    )

    const nextSourceOrganisationResolved = exceptionsResolvedFn(
      "nextSourceOrganisation",
      updatedFields,
      nextHearingLocationException,
      updatedFields.nextSourceOrganisation![0].offenceIndex,
      updatedFields.nextSourceOrganisation![0].resultIndex
    )

    expect(nextHearingDateExceptionResolved).toBe(true)
    expect(nextSourceOrganisationResolved).toBe(true)
  })

  it("Should return false when exception is not resolved", () => {
    const updatedFields = {} as Amendments

    const nextHearingDateExceptionResolved = exceptionsResolvedFn(
      "nextHearingDate",
      updatedFields,
      nextHearingDateException,
      0,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when irrelevant exception is resolved", () => {
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = exceptionsResolvedFn(
      "nextHearingDate",
      updatedFields,
      nextHearingDateException,
      0,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when exception is resolved in different offence", () => {
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "2024-03-30"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = exceptionsResolvedFn(
      "nextHearingDate",
      updatedFields,
      nextHearingDateException,
      0,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when nextHearingDate exception is resolved in different hearing result but in same offence", () => {
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 1,
          offenceIndex: 0,
          value: "2024-03-30"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = exceptionsResolvedFn(
      "nextHearingDate",
      updatedFields,
      nextHearingDateException,
      0,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when nextSourceOrganisation exception is resolved in different hearing result but in same offence", () => {
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 1,
          offenceIndex: 0,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const nextHearingDateExceptionResolved = exceptionsResolvedFn(
      "nextSourceOrganisation",
      updatedFields,
      nextHearingDateException,
      0,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when corrupted data is found in updatedFields", () => {
    const updatedFields = {
      nextHearingDate: undefined
    } as unknown as Amendments

    const nextHearingDateExceptionResolved = exceptionsResolvedFn(
      "nextHearingDate",
      updatedFields,
      nextHearingDateException,
      0,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })

  it("Should return false when corrupted offenceIndex is found in updatedFields", () => {
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: undefined,
          value: "2024-03-30"
        }
      ]
    } as unknown as Amendments

    const nextHearingDateExceptionResolved = exceptionsResolvedFn(
      "nextHearingDate",
      updatedFields,
      nextHearingDateException,
      0,
      0
    )

    expect(nextHearingDateExceptionResolved).toBe(false)
  })
})

describe("getOffenceAlertDetails", () => {
  const dummyAho = createDummyAho()

  it("Should return only one element when both exceptions have same offence indexes", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100322(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as Amendments

    const offenceAlertDetails = getOffenceAlertsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(offenceAlertDetails.length).toBe(1)
    expect(offenceAlertDetails[0].offenceIndex).toBe(0)
    expect(offenceAlertDetails[0].isResolved).toBe(false)
  })

  it("Should return two elements when both exceptions have different offence indexes", () => {
    const exceptions = [nextHearingDateException, nextHearingLocationException]
    const updatedFields = {} as Amendments

    const offenceAlertDetails = getOffenceAlertsDetails(exceptions, updatedFields)

    expect(offenceAlertDetails.length).toBe(2)
    expect(offenceAlertDetails[0].offenceIndex).toBe(0)
    expect(offenceAlertDetails[0].isResolved).toBe(false)
    expect(offenceAlertDetails[1].offenceIndex).toBe(1)
    expect(offenceAlertDetails[1].isResolved).toBe(false)
  })

  it("Should return isResolved:true for the first offence when only first one is resolved out of the two with different offence indexes", () => {
    const exceptions = [nextHearingDateException, nextHearingLocationException]
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ]
    } as Amendments

    const offenceAlertDetails = getOffenceAlertsDetails(exceptions, updatedFields)

    expect(offenceAlertDetails.length).toBe(2)
    expect(offenceAlertDetails[0].offenceIndex).toBe(0)
    expect(offenceAlertDetails[0].isResolved).toBe(true)
    expect(offenceAlertDetails[1].offenceIndex).toBe(1)
    expect(offenceAlertDetails[1].isResolved).toBe(false)
  })

  it("Should return isResolved:false when only one exception is resolved out of two having same indexes", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100322(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ]
    } as Amendments

    const offenceAlertDetails = getOffenceAlertsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(offenceAlertDetails.length).toBe(1)
    expect(offenceAlertDetails[0].offenceIndex).toBe(0)
    expect(offenceAlertDetails[0].isResolved).toBe(false)
  })

  it("Should return isResolved:true when both of the exceptions having same indexes are resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100322(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ],
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const offenceAlertDetails = getOffenceAlertsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(offenceAlertDetails.length).toBe(1)
    expect(offenceAlertDetails[0].offenceIndex).toBe(0)
    expect(offenceAlertDetails[0].isResolved).toBe(true)
  })

  describe("When one of the exceptions in unresolved in same offence but in different hearing result", () => {
    it("Should return isResolved:false if one of nextHearingDate exception is not updated", () => {
      dummyAho.Exceptions.length = 0
      HO100102(dummyAho, 0, 0)
      HO100102(dummyAho, 0, 1)
      const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
      const updatedFields = {
        nextHearingDate: [
          {
            resultIndex: 0,
            offenceIndex: 0,
            value: "2002-10-10"
          }
        ]
      } as Amendments

      const offenceAlertDetails = getOffenceAlertsDetails(courtCase.aho.Exceptions, updatedFields)

      expect(offenceAlertDetails.length).toBe(1)
      expect(offenceAlertDetails[0].offenceIndex).toBe(0)
      expect(offenceAlertDetails[0].isResolved).toBe(false)
    })

    it("Should return isResolved:false if one of nextSourceOrganisation exception is not updated", () => {
      dummyAho.Exceptions.length = 0
      HO100200(dummyAho, 0, 0)
      HO100200(dummyAho, 0, 1)
      const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
      const updatedFields = {
        nextSourceOrganisation: [
          {
            resultIndex: 0,
            offenceIndex: 0,
            value: "B21XA00"
          }
        ]
      } as Amendments

      const offenceAlertDetails = getOffenceAlertsDetails(courtCase.aho.Exceptions, updatedFields)

      expect(offenceAlertDetails.length).toBe(1)
      expect(offenceAlertDetails[0].offenceIndex).toBe(0)
      expect(offenceAlertDetails[0].isResolved).toBe(false)
    })

    it("Should return isResolved:false if when there are multiple exceptions and some of them are not updated", () => {
      dummyAho.Exceptions.length = 0
      HO100200(dummyAho, 0, 0)
      HO100200(dummyAho, 0, 1)
      HO100102(dummyAho, 0, 0)
      HO100102(dummyAho, 0, 1)

      const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
      const updatedFields = {
        nextSourceOrganisation: [
          {
            resultIndex: 0,
            offenceIndex: 0,
            value: "B21XA00"
          }
        ],
        nextHearingDate: [
          {
            resultIndex: 0,
            offenceIndex: 0,
            value: "2002-10-10"
          },
          {
            resultIndex: 1,
            offenceIndex: 0,
            value: "2002-10-10"
          }
        ]
      } as Amendments

      const offenceAlertDetails = getOffenceAlertsDetails(courtCase.aho.Exceptions, updatedFields)

      expect(offenceAlertDetails.length).toBe(1)
      expect(offenceAlertDetails[0].offenceIndex).toBe(0)
      expect(offenceAlertDetails[0].isResolved).toBe(false)
    })
  })

  it("Should return isResolved:true if when there are multiple exceptions and all of them updated", () => {
    dummyAho.Exceptions.length = 0
    HO100200(dummyAho, 0, 0)
    HO100200(dummyAho, 0, 1)
    HO100102(dummyAho, 0, 0)
    HO100102(dummyAho, 0, 1)

    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "B21XA00"
        },
        {
          resultIndex: 1,
          offenceIndex: 0,
          value: "B21XA00"
        }
      ],
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        },
        {
          resultIndex: 1,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ]
    } as Amendments

    const offenceAlertDetails = getOffenceAlertsDetails(courtCase.aho.Exceptions, updatedFields)

    expect(offenceAlertDetails.length).toBe(1)
    expect(offenceAlertDetails[0].offenceIndex).toBe(0)
    expect(offenceAlertDetails[0].isResolved).toBe(true)
  })
})
