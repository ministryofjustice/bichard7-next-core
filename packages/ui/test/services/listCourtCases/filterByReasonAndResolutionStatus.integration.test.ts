import type User from "services/entities/User"
import type { DataSource } from "typeorm"
import type { CaseListQueryParams } from "types/CaseListQueryParams"
import type { ListCourtCaseResult } from "types/ListCourtCasesResult"
import type { ResolutionStatus } from "types/ResolutionStatus"

import { isError } from "lodash"
import CourtCase from "services/entities/CourtCase"
import Note from "services/entities/Note"
import Trigger from "services/entities/Trigger"
import getDataSource from "services/getDataSource"
import listCourtCases from "services/listCourtCases"
import { Reason } from "types/CaseListQueryParams"

import type { TestTrigger } from "../../utils/manageTriggers"

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
import { insertTriggers } from "../../utils/manageTriggers"

describe("Filter cases by resolution status", () => {
  let dataSource: DataSource
  const courtCode = "36FPA1"
  const forceCode = "36"
  const anotherUserName = "someoneElse"

  const noGroupsUser = {
    groups: [],
    hasAccessTo: hasAccessToNone,
    visibleCourts: [],
    visibleForces: [forceCode]
  } as Partial<User> as User

  const exceptionHandler = {
    hasAccessTo: exceptionHandlerHasAccessTo,
    username: "exceptionHandler",
    visibleCourts: [],
    visibleForces: [forceCode]
  } as Partial<User> as User

  const triggerHandler = {
    hasAccessTo: triggerHandlerHasAccessTo,
    username: "triggerHandler",
    visibleCourts: [],
    visibleForces: [forceCode]
  } as Partial<User> as User

  const generalHandler = {
    hasAccessTo: generalHandlerHasAccessTo,
    username: "generalHandler",
    visibleCourts: [],
    visibleForces: [forceCode]
  } as Partial<User> as User

  const supervisor = {
    hasAccessTo: supervisorHasAccessTo,
    username: "generalHandler",
    visibleCourts: [],
    visibleForces: [forceCode]
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
        createdAt: new Date("2022-07-09T10:22:34.000Z"),
        status: status,
        triggerCode: triggerCode
      } as TestTrigger
    }

    const insertTestCaseWithTriggersAndExceptions = async (args: {
      caseId: number
      exception?: {
        exceptionResolvedBy?: string
      }
      trigger?: {
        bailsTrigger?: boolean
        triggerResolvedBy?: string
      }
    }) => {
      const triggerOrBailsTrigger = `${args.trigger?.bailsTrigger ? "Bails Trigger" : "Trigger"}`

      await insertCourtCasesWithFields([
        {
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
          errorId: args.caseId,
          errorResolvedTimestamp: args.exception?.exceptionResolvedBy ? new Date() : null,
          errorStatus: args.exception ? (args.exception?.exceptionResolvedBy ? "Resolved" : "Unresolved") : null,
          orgForPoliceFilter: courtCode,
          resolutionTimestamp:
            (args.trigger?.triggerResolvedBy && args.exception?.exceptionResolvedBy) ||
            (args.trigger?.triggerResolvedBy && !args.exception) ||
            (args.exception?.exceptionResolvedBy && !args.trigger)
              ? new Date()
              : undefined,
          triggerCount: args.trigger ? 1 : 0,
          triggerResolvedBy: args.trigger?.triggerResolvedBy,
          triggerResolvedTimestamp: args.trigger?.triggerResolvedBy ? new Date() : null,
          triggerStatus: args.trigger ? (args.trigger.triggerResolvedBy ? "Resolved" : "Unresolved") : null
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
        exception: {
          exceptionResolvedBy: undefined
        },
        trigger: {
          triggerResolvedBy: anotherUserName
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 1,
        exception: {
          exceptionResolvedBy: exceptionHandler.username
        },
        trigger: {
          triggerResolvedBy: undefined
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 2,
        exception: {
          exceptionResolvedBy: exceptionHandler.username
        },
        trigger: {
          triggerResolvedBy: triggerHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 3,
        exception: {
          exceptionResolvedBy: anotherUserName
        },
        trigger: {
          triggerResolvedBy: generalHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 4,
        exception: {
          exceptionResolvedBy: generalHandler.username
        },
        trigger: {
          triggerResolvedBy: anotherUserName
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 5,
        exception: {
          exceptionResolvedBy: generalHandler.username
        },
        trigger: {
          triggerResolvedBy: generalHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 6,
        exception: {
          exceptionResolvedBy: undefined
        },
        trigger: {
          triggerResolvedBy: undefined
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 7,
        exception: undefined,
        trigger: {
          bailsTrigger: true,
          triggerResolvedBy: anotherUserName
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 8,
        exception: undefined,
        trigger: {
          bailsTrigger: true,
          triggerResolvedBy: triggerHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 9,
        exception: undefined,
        trigger: {
          bailsTrigger: true,
          triggerResolvedBy: undefined
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 10,
        exception: {
          exceptionResolvedBy: undefined
        },
        trigger: undefined
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 11,
        exception: {
          exceptionResolvedBy: generalHandler.username
        },
        trigger: undefined
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 12,
        exception: undefined,
        trigger: {
          bailsTrigger: true,
          triggerResolvedBy: generalHandler.username
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 13,
        exception: {
          exceptionResolvedBy: generalHandler.username
        },
        trigger: {
          bailsTrigger: true,
          triggerResolvedBy: anotherUserName
        }
      })
      await insertTestCaseWithTriggersAndExceptions({
        caseId: 14,
        exception: {
          exceptionResolvedBy: undefined
        },
        trigger: {
          bailsTrigger: true,
          triggerResolvedBy: undefined
        }
      })
    })

    const testCases: {
      description: string
      expectedCases: string[]
      filters: Partial<CaseListQueryParams>
      user: User
    }[] = [
      {
        description: "Shouldn't show cases to a user with no permissions",
        expectedCases: [],
        filters: {},
        user: noGroupsUser
      },
      {
        description: "Shouldn't show cases to a user with no permissions when a reason filter is passed",
        expectedCases: [],
        filters: {
          reason: Reason.Triggers
        },
        user: noGroupsUser
      },
      {
        description:
          "Should see cases with unresolved exceptions when user is an exception handler and unresolved filter applied",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: "Unresolved"
        },
        user: exceptionHandler
      },
      {
        description:
          "Should see cases with resolved exceptions when user is an exception handler and resolved filter applied",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler"
        ],
        filters: {
          caseState: "Resolved"
        },
        user: exceptionHandler
      },
      {
        description:
          "Should see cases with unresolved triggers when user is a trigger handler and unresolved filter applied",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: "Unresolved"
        },
        user: triggerHandler
      },
      {
        description:
          "Should see cases with unresolved triggers when user is a trigger handler and searches for TRPR0010",
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved", // Sees this case as it has the reason code
          "No exceptions/Bails Trigger Unresolved"
        ],
        filters: {
          reasonCodes: ["TRPR0010"]
        },
        user: triggerHandler
      },
      {
        description:
          "Should see cases with unresolved exception when user is a exception handler and searches for HO100300",
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved"
        ],
        filters: {
          reasonCodes: ["HO100300"]
        },
        user: exceptionHandler
      },

      {
        description:
          "Should see cases with unresolved triggers when user is a general handler and searches for TRPR0010",
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved", // Sees this case as it has the reason code
          "No exceptions/Bails Trigger Unresolved"
        ],
        filters: {
          reasonCodes: ["TRPR0010"]
        },
        user: generalHandler
      },
      {
        description:
          "Should see cases with unresolved exceptions when user is a general handler and searches for HO100300",
        expectedCases: [
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved"
        ],
        filters: {
          reasonCodes: ["HO100300"]
        },
        user: generalHandler
      },
      {
        description:
          "Should see cases with unresolved exceptions when user is a general handler and searches for HO100300 and TRPR0010",
        expectedCases: [
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved"
        ],
        filters: {
          reasonCodes: ["HO100300", "TRPR0010"]
        },
        user: generalHandler
      },
      {
        description:
          "Should see cases with resolved exceptions and triggers when user is a general handler and searches for HO100300 and TRPR0010",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by generalHandler"
        ],
        filters: {
          caseState: "Resolved",
          reasonCodes: ["HO100300", "TRPR0010"]
        },
        user: generalHandler
      },
      {
        description:
          "Should see cases with resolved exceptions when user is a general handler and searches for HO100300",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
        ],
        filters: {
          caseState: "Resolved",
          reasonCodes: ["HO100300"]
        },
        user: generalHandler
      },
      {
        description: "Should see cases with resolved triggers when user is a general handler and searches for TRPR0010",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by generalHandler"
        ],
        filters: {
          caseState: "Resolved",
          reasonCodes: ["TRPR0010"]
        },
        user: generalHandler
      },
      {
        description: "Should see all cases with resolved triggers when user is a supervisor and searches for TRPR0010",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by someoneElse",
          "No exceptions/Bails Trigger Resolved by triggerHandler"
        ],
        filters: {
          caseState: "Resolved",
          reasonCodes: ["TRPR0010"]
        },
        user: supervisor
      },
      {
        description:
          "Should see all cases with resolved exceptions when user is a supervisor and searches for HO100300",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler"
        ],
        filters: {
          caseState: "Resolved",
          reasonCodes: ["HO100300"]
        },
        user: supervisor
      },
      {
        description:
          "Should see cases with resolved triggers when user is a trigger handler and resolved filter applied",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler",
          "No exceptions/Bails Trigger Resolved by triggerHandler"
        ],
        filters: {
          caseState: "Resolved"
        },
        user: triggerHandler
      },
      {
        description:
          "Should see cases with unresolved triggers or unresolved exceptions when user is a general handler and unresolved filter applied",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: "Unresolved"
        },
        user: generalHandler
      },
      {
        description:
          "Should see cases with resolved triggers and exceptions when user is a general handler and resolved filter applied",
        expectedCases: [
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/No triggers",
          "No exceptions/Bails Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse"
        ],
        filters: {
          caseState: "Resolved"
        },
        user: generalHandler
      },
      {
        description:
          "Should see cases with unresolved triggers or unresolved exceptions when user is a supervisor and resolved filter applied",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: "Unresolved"
        },
        user: supervisor
      },
      {
        description:
          "Should see cases with triggers and exceptions, resolved by anyone when user is a supervisor and resolved filter applied",
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
        ],
        filters: {
          caseState: "Resolved"
        },
        user: supervisor
      },
      {
        description:
          "Should return cases with unresolved triggers when filtering for unresolved triggers as general handler",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: "Unresolved",
          reason: Reason.Triggers
        },
        user: generalHandler
      },
      {
        description:
          "Should return cases with resolved triggers when filtering for resolved triggers as a general handler",
        expectedCases: [
          "Exceptions Resolved by someoneElse/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "No exceptions/Bails Trigger Resolved by generalHandler"
        ],
        filters: {
          caseState: "Resolved",
          reason: Reason.Triggers
        },
        user: generalHandler
      },
      {
        description:
          "Should return cases with unresolved exceptions when filtering for unresolved exceptions as a general handler",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: "Unresolved",
          reason: Reason.Exceptions
        },
        user: generalHandler
      },
      {
        description:
          "Should return cases with resolved exceptions when filtering for resolved exceptions as a general handler",
        expectedCases: [
          "Exceptions Resolved by generalHandler/Trigger Resolved by someoneElse",
          "Exceptions Resolved by generalHandler/Trigger Resolved by generalHandler",
          "Exceptions Resolved by generalHandler/No triggers",
          "Exceptions Resolved by generalHandler/Bails Trigger Resolved by someoneElse"
        ],
        filters: {
          caseState: "Resolved",
          reason: Reason.Exceptions
        },
        user: generalHandler
      },
      {
        description: "Should see no cases when filtering for resolved exceptions as a trigger handler",
        expectedCases: [],
        filters: {
          caseState: "Resolved",
          reason: Reason.Exceptions
        },
        user: triggerHandler
      },
      {
        description:
          "Should only see cases with unresolved triggers when filtering for unresolved exceptions as a trigger handler",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: "Unresolved",
          reason: Reason.Exceptions
        },
        user: triggerHandler
      },
      {
        description: "Should see no cases when filtering for resolved triggers as a exception handler",
        expectedCases: [],
        filters: {
          caseState: "Resolved",
          reason: Reason.Triggers
        },
        user: exceptionHandler
      },
      {
        description:
          "Should only see cases with unresolved exceptions when filtering for unresolved triggers as a exception handler",
        expectedCases: [
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {
          caseState: "Unresolved",
          reason: Reason.Triggers
        },
        user: exceptionHandler
      },
      {
        description:
          "Should only see trigger that is resolved by themselves when searching a bails trigger code as a trigger handler",
        expectedCases: ["No exceptions/Bails Trigger Resolved by triggerHandler"],
        filters: {
          caseState: "Resolved",
          reasonCodes: [bailsTriggerCode]
        },
        user: triggerHandler
      },
      {
        description:
          "Should only see exception that is resolved by themselves when searching an exception code as an exception handler",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler"
        ],
        filters: {
          caseState: "Resolved",
          reasonCodes: ["HO100300"]
        },
        user: exceptionHandler
      },
      {
        description:
          "Should only see exception that has unresolved exception when searching a trigger code as an exception handler",
        expectedCases: ["Exceptions Unresolved/Trigger Unresolved", "Exceptions Unresolved/Bails Trigger Unresolved"],
        filters: {
          caseState: "Unresolved",
          reasonCodes: [dummyTriggerCode, bailsTriggerCode]
        },
        user: exceptionHandler
      },
      {
        description:
          "Should only see exception that has exception resolved by themselves when searching a trigger code as an exception handler",
        expectedCases: ["Exceptions Resolved by exceptionHandler/Trigger Resolved by triggerHandler"],
        filters: {
          caseState: "Resolved",
          reasonCodes: ["TRPR0001"]
        },
        user: exceptionHandler
      },
      {
        description: "Should only see unresolved triggers when case state is not set as a trigger handler",
        expectedCases: [
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {},
        user: triggerHandler
      },
      {
        description: "Should only see unresolved exceptions when case state is not set as an exceptions handler",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Unresolved/Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {},
        user: exceptionHandler
      },
      {
        description: "Should see unresolved triggers and exceptions when case state is not set as a general handler",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {},
        user: generalHandler
      },
      {
        description: "Should see unresolved triggers and exceptions when case state is not set as a supervisor",
        expectedCases: [
          "Exceptions Unresolved/Trigger Resolved by someoneElse",
          "Exceptions Resolved by exceptionHandler/Trigger Unresolved",
          "Exceptions Unresolved/Trigger Unresolved",
          "No exceptions/Bails Trigger Unresolved",
          "Exceptions Unresolved/No triggers",
          "Exceptions Unresolved/Bails Trigger Unresolved"
        ],
        filters: {},
        user: supervisor
      }
    ]

    it.each(testCases)("$description", async ({ expectedCases, filters, user }) => {
      const result = await listCourtCases(dataSource, { maxPageItems: 100, ...filters }, user)

      expect(isError(result)).toBeFalsy()
      const { result: cases } = result as ListCourtCaseResult

      const defendantNames = cases.map((c) => c.defendantName).sort()

      expect(defendantNames).toStrictEqual(expectedCases.sort())
    })
  })
})
