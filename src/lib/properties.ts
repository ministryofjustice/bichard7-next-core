import type { KeyValue } from "../types/KeyValue"

const ENTERED_IN_ERROR_RESULT_CODE = 4583 // Hearing Removed
const STOP_LIST = [
  1000, 1505, 1509, 1510, 1511, 1513, 1514, 2069, 2501, 2505, 2507, 2508, 2509, 2511, 2514, 3501, 3502, 3503, 3504,
  3508, 3509, 3510, 3512, 3514, 4049, 4505, 4507, 4509, 4510, 4532, 4534, 4544, 4584, 4585, 4586, 3118, 4592, 4593,
  4594, 4595, 4596, 4597
]
const COMMON_LAWS = "COML"
const INDICTMENT = "XX00"
const DONT_KNOW_VALUE = "D"
const ADJOURNMENT_SINE_DIE_RESULT_CODE_STRING = "2007"

const TIME_RANGE = {
  ON_OR_IN: 1,
  BEFORE: 2,
  AFTER: 3,
  BETWEEN: 4,
  ON_OR_ABOUT: 5,
  ON_OR_BEFORE: 6
}

const FREE_TEXT_RESULT_CODE = 1000
const OTHER_VALUE = "OTHER"
const WARRANT_ISSUE_DATE_RESULT_CODES = [4505, 4575, 4576, 4577, 4585, 4586]
const OFFENCES_TIC_RESULT_TEXT = "other offences admitted and taken into consideration"
const OFFENCES_TIC_RESULT_CODE = -1
const LIBRA_MAX_QUALIFIERS = 4
const LIBRA_ELECTRONIC_TAGGING_TEXT = "to be electronically monitored"
const TAGGING_FIX_REMOVE = [1115, 1116, 1141, 1142, 1143]
const BAIL_QUALIFIER_CODE = "BA"
const RESULT_TEXT_PATTERN_CODES: KeyValue<string[]> = {
  "4025": ["1"],
  "4027": ["2ab", "2c3b"],
  "4028": ["3a", "2c3b"],
  "4029": ["3a", "2c3b"],
  "4030": ["3a", "2c3b"],
  "4046": ["3a", "2c3b"],
  "4047": ["2ab"],
  "4048": ["1", "4"],
  "4053": ["1"],
  "4570": ["1"],
  "4571": ["1"],
  "4530": ["2ab", "2c3b"],
  "4542": ["2ab"],
  "4531": ["3a", "2c3b"],
  "4533": ["3a", "2c3b"],
  "4537": ["3a", "2c3b"],
  "4539": ["3a", "2c3b"],
  "4558": ["4"],
  "4559": ["4"],
  "4560": ["4"],
  "4561": ["4"],
  "4562": ["4"],
  "4563": ["4"],
  "4564": ["4"],
  "4565": ["1", "4"],
  "4566": ["1"],
  "4567": ["4"]
}
const RESULT_TEXT_PATTERN_REGEX: KeyValue<RegExp> = {
  "1": /[Cc]ommitted to (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "2ab": /to appear (?:at|before) (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "4": /Act \\d{4} to (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "3a": /[tT]o be brought before (?<Court>.*? (?:Crown|Criminal) Court)(?:.*on (?<Date>.*) or such other date)?/,
  "2c3b":
    /until the Crown Court hearing (?:(?:.*on (?<Date>.*) or such other date.*as the Crown Court directs,? (?<Court>.*? (?:Crown|Criminal) Court))|(?:.*time to be fixed,? (?<Court2>.*? (?:Crown|Criminal) Court)))/
}
const CROWN_COURT_NAME_MAPPING_OVERRIDES: KeyValue<string> = {
  "Newport (South Wales) Crown Court": "0441",
  "Great Grimsby Crown Court": "0425"
}
const TAGGING_FIX_ADD = 3105
const CROWN_COURT_TOP_LEVEL_CODE = "C"
const TOP_LEVEL_MAGISTRATES_COURT = "B"
const YOUTH_COURT = "YOUTH"
const MC_YOUTH = "MCY"
const MC_ADULT = "MCA"
const CROWN_COURT = "CC"

export {
  ENTERED_IN_ERROR_RESULT_CODE,
  STOP_LIST,
  COMMON_LAWS,
  INDICTMENT,
  DONT_KNOW_VALUE,
  ADJOURNMENT_SINE_DIE_RESULT_CODE_STRING,
  TIME_RANGE,
  FREE_TEXT_RESULT_CODE,
  OTHER_VALUE,
  WARRANT_ISSUE_DATE_RESULT_CODES,
  OFFENCES_TIC_RESULT_TEXT,
  OFFENCES_TIC_RESULT_CODE,
  LIBRA_MAX_QUALIFIERS,
  LIBRA_ELECTRONIC_TAGGING_TEXT,
  TAGGING_FIX_REMOVE,
  BAIL_QUALIFIER_CODE,
  RESULT_TEXT_PATTERN_CODES,
  RESULT_TEXT_PATTERN_REGEX,
  CROWN_COURT_NAME_MAPPING_OVERRIDES,
  TAGGING_FIX_ADD,
  CROWN_COURT_TOP_LEVEL_CODE,
  TOP_LEVEL_MAGISTRATES_COURT,
  YOUTH_COURT,
  MC_YOUTH,
  MC_ADULT,
  CROWN_COURT
}
