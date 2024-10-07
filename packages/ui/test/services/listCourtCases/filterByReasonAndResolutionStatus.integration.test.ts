import { isError } from "lodash"
import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import Trigger from "services/entities/Trigger"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import { DataSource } from "typeorm"
import { CaseListQueryParams, Reason } from "types/CaseListQueryParams"
import { ListCourtCaseResult } from "types/ListCourtCasesResult"
import { ResolutionStatus } from "types/ResolutionStatus"
import {
  exceptionHandlerHasAccessTo,
  generalHandlerHasAccessTo,
  hasAccessToNone,
  supervisorHasAccessTo,
  triggerHandlerHasAccessTo
} from "../../helpers/hasAccessTo"
import deleteFromEntity from "../../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../../utils/insertCourtCases"
import insertException from "../../utils/manageExceptions"
import { TestTrigger, insertTriggers } from "../../utils/manageTriggers"

describe("Filter cases by resolution status", () => {
  let dataSource: DataSource
  const courtCode = "36FPA1"
  const forceCode = "36"
  const anotherUserName = "someoneElse"

  const noGroupsUser = {
    visibleForces: [forceCode],
    visibleCourts: [],
    groups: [],
    hasAccessTo: hasAccessToNone
  } as Partial<User> as User

  const exceptionHandler = {
    username: "exceptionHandler",
    visibleForces: [forceCode],
    visibleCourts: [],
    hasAccessTo: exceptionHandlerHasAccessTo
  } as Partial<User> as User

  const triggerHandler = {
    username: "triggerHandler",
    visibleForces: [forceCode],
    visibleCourts: [],
    hasAccessTo: triggerHandlerHasAccessTo
  } as Partial<User> as User

  const generalHandler = {
    username: "generalHandler",
    visibleForces: [forceCode],
    visibleCourts: [],
    hasAccessTo: generalHandlerHasAccessTo
  } as Partial<User> as User

  const supervisor = {
    username: "generalHandler",
    visibleForces: [forceCode],
    visibleCourts: [],
    hasAccessTo: supervisorHasAccessTo
  } as Partial<User> as User

  beforeAll(async () => {
    dataSource = await getDataSource()
    await deleteFromEntity(CourtCase)
    await deleteFromEntity(Trigger)
    await deleteFromEntity(Note)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  describe("Filter cases having by resolution status, reason code and user permission", () => {
    const dummyTriggerCode = "TRPR0001"
    const bailsTriggerCode = "TRPR0010"
    const getTrigger = (triggerCode: string, status: ResolutionStatus): TestTrigger => {
      return {
        triggerCode: triggerCode,
        status: status,
        createdAt: new Date("2022-07-09T10:22:34.000Z")
      } as TestTrigger
    }

    const insertTestCaseWithTriggersAndExceptions = async (args: {
      caseId: number
      trigger?: {
        triggerResolvedBy?: string
        bailsTrigger?: boolean
      }
      exception?: {
        exceptionResolvedBy?: string
      }
    }) => {
      const triggerOrBailsTrigger = `${args.trigger?.bailsTrigger ? "Bails Trigger" : "Trigger"}`

      await insertCourtCasesWithFields([
        {
          errorId: args.caseId,
          defendantName: `${
            args.exception?.exceptionResolvedBy
              ? `Exceptions Resolved by ${args.exception.exceptionResolvedBy}`
              : `${args.exception ? "Exceptions Unresolved" : "No exceptions"}`
          }/${
            args.trigger?.triggerResolvedBy
              ? `${triggerOrBailsTrigger} Resolved by ${args.trigger.triggerResolvedBy}`
              : `${args.trigger ? `${triggerOrBailsTrigger} Unresolved` : "No triggers"}`
          }`,
          errorCount: args.exception ? 1 : 0,
          orgForPoliceFilter: courtCode,
          triggerResolvedBy: args.trigger?.triggerResolvedBy,
          triggerResolvedTimestamp: args.trigger?.triggerResolvedBy ? new Date() : null,
          triggerStatus: args.trigger ? (args.trigger.triggerResolvedBy ? "Resolved" : "Unresolved") : null,
          errorStatus: args.exception ? (args.exception?.exceptionResolvedBy ? "Resolved" : "Unresolved") : null,
          errorResolvedTimestamp: args.exception?.exceptionResolvedBy ? new Date() : null,
          triggerCount: args.trigger ? 1 : 0,
          resolutionTimestamp:
            (args.trigger?.triggerResolvedBy && args.exception?.exceptionResolvedBy) ||
            (args.trigger?.triggerResolvedBy && !args.exception) ||
            (args.exception?.exceptionResolvedBy && !args.trigger)
              ? new Date()
              : undefined
        }
      ])
      if (args.trigger) {
        await insertTriggers(
          args.caseId,
          [
            getTrigger(
              args.trigger.bailsTrigger ? bailsTriggerCode : dummyTriggerCode,
              args.trigger.triggerResolvedBy ? "Resolved" : "Unresolved"
            )
          ],
          args.trigger.triggerResolvedBy
        )
      }
      if (args.exception) {
        await insertException(
          args.caseId,
          "HO100300",
          "HO100300||b7.errorReport",
          args.exception.exceptionResolvedBy ? "Resolved" : "Unresolved",
          args.exception.exceptionResolvedBy
        )
      }
    }

    beforeAll(async () => {
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 0,
        trigger: {
          triggerResolvedBy: anotherUserName
        },
        exception: {
          exceptionResolvedBy: undefined
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 1,
        trigger: {
          triggerResolvedBy: undefined
        },
        exception: {
          exceptionResolvedBy: exceptionHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 2,
        trigger: {
          triggerResolvedBy: triggerHandler.username
        },
        exception: {
          exceptionResolvedBy: exceptionHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 3,
        trigger: {
          triggerResolvedBy: generalHandler.username
        },
        exception: {
          exceptionResolvedBy: anotherUserName
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 4,
        trigger: {
          triggerResolvedBy: anotherUserName
        },
        exception: {
          exceptionResolvedBy: generalHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 5,
        trigger: {
          triggerResolvedBy: generalHandler.username
        },
        exception: {
          exceptionResolvedBy: generalHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 6,
        trigger: {
          triggerResolvedBy: undefined
        },
        exception: {
          exceptionResolvedBy: undefined
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 7,
        trigger: {
          triggerResolvedBy: anotherUserName,
          bailsTrigger: true
        },
        exception: undefined
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 8,
        trigger: {
          triggerResolvedBy: triggerHandler.username,
          bailsTrigger: true
        },
        exception: undefined
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 9,
        trigger: {
          triggerResolvedBy: undefined,
          bailsTrigger: true
        },
        exception: undefined
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 10,
        trigger: undefined,
        exception: {
          exceptionResolvedBy: undefined
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 11,
        trigger: undefined,
        exception: {
          exceptionResolvedBy: generalHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 12,
        trigger: {
          triggerResolvedBy: generalHandler.username,
          bailsTrigger: true
        },
        exception: undefined
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 13,
        trigger: {
          triggerResolvedBy: anotherUserName,
          bailsTrigger: true
        },
        exception: {
          exceptionResolvedBy: generalHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 14,
        trigger: {
          triggerResolvedBy: undefined,
          bailsTrigger: true
        },
        exception: {
          exceptionResolvedBy: undefined
        }
      })
    })

    const testCases: {
      description: string
      filters: Partial<CaseListQueryParams>
      user: User
      expectedCases: string[]
    }[] = [
      {
        description: "Shouldn't show cases to a user with no permissions",
        filters: {},
        user: noGroupsUser,
        expectedCases: []
      },
      {
        description: "Shouldn't show cases to a user with no permissions when a reason filter is passed",
        filters: {
          reason: Reason.Triggers
        },
        user: noGroupsUser,
        expectedCases: []
      },
      {
        description:
          "Should see cases with unresolved exceptions when user is an exception handler and unresolved filter applied",
        filters: {
          caseState: "Unresolved"
        },
        user: exceptionHandler,
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ]
      },
      {
        description:
          "Should see cases with resolved exceptions when user is an exception handler and resolved filter applied",
        filters: {
          caseState: "Resolved"
        },
        user: exceptionHandler,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler"
        ]
      },
      {
        description:
          "Should see cases with unresolved triggers when user is a trigger handler and unresolved filter applied",
        filters: {
          caseState: "Unresolved"
        },
        user: triggerHandler,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ]
      },
      {
        description:
          "Should see cases with unresolved triggers when user is a trigger handler and searches for TRPR0010",
        filters: {
          reasonCodes: ["TRPR0010"]
        },
        user: triggerHandler,
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved", // Sees this case as it has the reason code
          "No exceptions/Bails Trigger Unresolved"
        ]
      },
      {
        description:
          "Should see cases with unresolved exception when user is a exception handler and searches for HO100300",
        filters: {
          reasonCodes: ["HO100300"]
        },
        user: exceptionHandler,
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved"
        ]
      },

      {
        description:
          "Should see cases with unresolved triggers when user is a general handler and searches for TRPR0010",
        filters: {
          reasonCodes: ["TRPR0010"]
        },
        user: generalHandler,
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved", // Sees this case as it has the reason code
          "No exceptions/Bails Trigger Unresolved"
        ]
      },
      {
        description:
          "Should see cases with unresolved exceptions when user is a general handler and searches for HO100300",
        filters: {
          reasonCodes: ["HO100300"]
        },
        user: generalHandler,
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved"
        ]
      },
      {
        description:
          "Should see cases with unresolved exceptions when user is a general handler and searches for HO100300 and TRPR0010",
        filters: {
          reasonCodes: ["HO100300", "TRPR0010"]
        },
        user: generalHandler,
        expectedCases: [
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved"
        ]
      },
      {
        description:
          "Should see cases with resolved exceptions and triggers when user is a general handler and searches for HO100300 and TRPR0010",
        filters: {
          reasonCodes: ["HO100300", "TRPR0010"],
          caseState: "Resolved"
        },
        user: generalHandler,
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by generalHandler"
        ]
      },
      {
        description:
          "Should see cases with resolved exceptions when user is a general handler and searches for HO100300",
        filters: {
          reasonCodes: ["HO100300"],
          caseState: "Resolved"
        },
        user: generalHandler,
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
        ]
      },
      {
        description: "Should see cases with resolved triggers when user is a general handler and searches for TRPR0010",
        filters: {
          reasonCodes: ["TRPR0010"],
          caseState: "Resolved"
        },
        user: generalHandler,
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by generalHandler"
        ]
      },
      {
        description: "Should see all cases with resolved triggers when user is a supervisor and searches for TRPR0010",
        filters: {
          reasonCodes: ["TRPR0010"],
          caseState: "Resolved"
        },
        user: supervisor,
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by triggerHandler"
        ]
      },
      {
        description:
          "Should see all cases with resolved exceptions when user is a supervisor and searches for HO100300",
        filters: {
          reasonCodes: ["HO100300"],
          caseState: "Resolved"
        },
        user: supervisor,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
        ]
      },
      {
        description:
          "Should see cases with resolved triggers when user is a trigger handler and resolved filter applied",
        filters: {
          caseState: "Resolved"
        },
        user: triggerHandler,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "No exceptions/Bails Trigger Resolved by triggerHandler"
        ]
      },
      {
        description:
          "Should see cases with unresolved triggers or unresolved exceptions when user is a general handler and unresolved filter applied",
        filters: {
          caseState: "Unresolved"
        },
        user: generalHandler,
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ]
      },
      {
        description:
          "Should see cases with resolved triggers and exceptions when user is a general handler and resolved filter applied",
        filters: {
          caseState: "Resolved"
        },
        user: generalHandler,
        expectedCases: [
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/No triggers",
          "No exceptions/Bails Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse"
        ]
      },
      {
        description:
          "Should see cases with unresolved triggers or unresolved exceptions when user is a supervisor and resolved filter applied",
        filters: {
          caseState: "Unresolved"
        },
        user: supervisor,
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ]
      },
      {
        description:
          "Should see cases with triggers and exceptions, resolved by anyone when user is a supervisor and resolved filter applied",
        filters: {
          caseState: "Resolved"
        },
        user: supervisor,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by triggerHandler",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by generalHandler",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved"
        ]
      },
      {
        description:
          "Should return cases with unresolved triggers when filtering for unresolved triggers as general handler",
        filters: {
          caseState: "Unresolved",
          reason: Reason.Triggers
        },
        user: generalHandler,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ]
      },
      {
        description:
          "Should return cases with resolved triggers when filtering for resolved triggers as a general handler",
        filters: {
          caseState: "Resolved",
          reason: Reason.Triggers
        },
        user: generalHandler,
        expectedCases: [
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by generalHandler"
        ]
      },
      {
        description:
          "Should return cases with unresolved exceptions when filtering for unresolved exceptions as a general handler",
        filters: {
          caseState: "Unresolved",
          reason: Reason.Exceptions
        },
        user: generalHandler,
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ]
      },
      {
        description:
          "Should return cases with resolved exceptions when filtering for resolved exceptions as a general handler",
        filters: {
          caseState: "Resolved",
          reason: Reason.Exceptions
        },
        user: generalHandler,
        expectedCases: [
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse"
        ]
      },
      {
        description: "Should see no cases when filtering for resolved exceptions as a trigger handler",
        filters: {
          caseState: "Resolved",
          reason: Reason.Exceptions
        },
        user: triggerHandler,
        expectedCases: []
      },
      {
        description:
          "Should only see cases with unresolved triggers when filtering for unresolved exceptions as a trigger handler",
        filters: {
          caseState: "Unresolved",
          reason: Reason.Exceptions
        },
        user: triggerHandler,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved"
        ]
      },
      {
        description: "Should see no cases when filtering for resolved triggers as a exception handler",
        filters: {
          caseState: "Resolved",
          reason: Reason.Triggers
        },
        user: exceptionHandler,
        expectedCases: []
      },
      {
        description:
          "Should only see cases with unresolved exceptions when filtering for unresolved triggers as a exception handler",
        filters: {
          caseState: "Unresolved",
          reason: Reason.Triggers
        },
        user: exceptionHandler,
        expectedCases: [
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ]
      },
      {
        description:
          "Should only see trigger that is resolved by themselves when searching a bails trigger code as a trigger handler",
        filters: {
          caseState: "Resolved",
          reasonCodes: [bailsTriggerCode]
        },
        user: triggerHandler,
        expectedCases: ["No exceptions/Bails Trigger Resolved by triggerHandler"]
      },
      {
        description:
          "Should only see exception that is resolved by themselves when searching an exception code as an exception handler",
        filters: {
          caseState: "Resolved",
          reasonCodes: ["HO100300"]
        },
        user: exceptionHandler,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler"
        ]
      },
      {
        description:
          "Should only see exception that has unresolved exception when searching a trigger code as an exception handler",
        filters: {
          caseState: "Unresolved",
          reasonCodes: [dummyTriggerCode, bailsTriggerCode]
        },
        user: exceptionHandler,
        expectedCases: ["Exceptions Unresolved/Trigger Unresolved", "Exceptions Unresolved/Bails Trigger Unresolved"]
      },
      {
        description:
          "Should only see exception that has exception resolved by themselves when searching a trigger code as an exception handler",
        filters: {
          caseState: "Resolved",
          reasonCodes: ["TRPR0001"]
        },
        user: exceptionHandler,
        expectedCases: ["Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler"]
      },
      {
        description: "Should only see unresolved triggers when case state is not set as a trigger handler",
        filters: {},
        user: triggerHandler,
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ]
      },
      {
        description: "Should only see unresolved exceptions when case state is not set as an exceptions handler",
        filters: {},
        user: exceptionHandler,
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ]
      },
      {
        description: "Should see unresolved triggers and exceptions when case state is not set as a general handler",
        filters: {},
        user: generalHandler,
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ]
      },
      {
        description: "Should see unresolved triggers and exceptions when case state is not set as a supervisor",
        filters: {},
        user: supervisor,
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ]
      }
    ]

    it.each(testCases)("$description", async ({ filters, user, expectedCases }) => {
      const result = await listCourtCases(dataSource, { maxPageItems: 100, ...filters }, user)

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      const defendantNames = cases.map((c) => c.defendantName).sort()

      expect(defendantNames).toStrictEqual(expectedCases.sort())
    })
  })
})
