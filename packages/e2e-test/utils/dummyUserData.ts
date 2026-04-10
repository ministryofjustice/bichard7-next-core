type DummyUser = {
  inclusionList: string[]
  exclusionList: string[]
  visible_courts: string[]
  visible_forces: string[]
  excluded_triggers: string[]
  groups: string[]
}

// Note: These users are only created automatically when running against Postgres - they will need seeding in DB2 or LDAP
const dummyUsers: Record<string, DummyUser> = {
  supervisor: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7Supervisor"]
  },
  generalhandler: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7GeneralHandler"]
  },
  triggerhandler: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7TriggerHandler"]
  },
  exceptionhandler: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7ExceptionHandler"]
  },
  auditor: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7Audit"]
  },
  supervisorwithexcludedtrpr0006: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: ["TRPR0006"],
    groups: ["B7Supervisor"]
  },
  triggerhandlerwithexcludedtrpr0006: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: ["TRPR0006"],
    groups: ["B7TriggerHandler"]
  },
  triggerhandlerwithexcludedtrpr0008: {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: ["TRPR0008"],
    groups: ["B7TriggerHandler"]
  },
  "old.bichard.user": {
    inclusionList: [],
    exclusionList: [],
    visible_courts: ["B01", "B41ME00"],
    visible_forces: ["01"],
    excluded_triggers: [],
    groups: ["B7GeneralHandler", "B7NewUI"]
  },
  "met.police": {
    inclusionList: ["001"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["001"],
    excluded_triggers: [],
    groups: ["B7Supervisor"]
  },
  "wilt.shire": {
    inclusionList: ["054"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["054"],
    excluded_triggers: [],
    groups: ["B7Supervisor"]
  },
  "super.fivefour": {
    inclusionList: ["054"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["054"],
    excluded_triggers: [],
    groups: ["B7Supervisor"]
  },
  "br7.btp": {
    inclusionList: ["093"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["093"],
    excluded_triggers: [],
    groups: ["B7Supervisor"]
  },
  "west.yorkshire": {
    inclusionList: [],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["013"],
    excluded_triggers: [],
    groups: ["B7Supervisor"]
  },
  "essex.user": {
    inclusionList: ["042"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["042"],
    excluded_triggers: [],
    groups: ["B7Supervisor"]
  },
  "norfolk.user": {
    inclusionList: ["036"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["036"],
    excluded_triggers: [],
    groups: ["B7Supervisor"]
  },
  "trigger.fivefourexcl": {
    inclusionList: ["B01HO", "B01EF"],
    exclusionList: ["TRPR0003", "TRPR0004", "TRPR0006"],
    visible_courts: ["B01HO", "B01EF"],
    visible_forces: [],
    excluded_triggers: ["TRPR0003", "TRPR0004", "TRPR0006"],
    groups: ["B7TriggerHandler"]
  },
  "general.handlerexclone": {
    inclusionList: ["B01HO", "B01EF"],
    exclusionList: ["TRPR0004", "TRPR0006"],
    visible_courts: ["B01HO", "B01EF"],
    visible_forces: [],
    excluded_triggers: ["TRPR0004", "TRPR0006"],
    groups: ["B7GeneralHandler"]
  },
  "herts.user": {
    inclusionList: ["041"],
    exclusionList: [],
    visible_courts: [],
    visible_forces: ["041"],
    excluded_triggers: [],
    groups: ["B7Supervisor"]
  }
}

export default dummyUsers
