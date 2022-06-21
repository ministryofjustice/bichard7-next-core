import type { KeyValue } from "src/types/KeyValue"

const ENTERED_IN_ERROR_RESULT_CODE = 4583 // Hearing Removed
const STOP_LIST = [
  1000, 1505, 1509, 1510, 1511, 1513, 1514, 2069, 2501, 2505, 2507, 2508, 2509, 2511, 2514, 3501, 3502, 3503, 3504,
  3508, 3509, 3510, 3512, 3514, 4049, 4505, 4507, 4509, 4510, 4532, 4534, 4544, 4584, 4585, 4586, 3118, 4592, 4593,
  4594, 4595, 4596, 4597
]
const COMMON_LAWS = "COML"
const INDICTMENT = "XX00"
const DONT_KNOW_VALUE = "D"
const ADJOURNMENT_SINE_DIE_RESULT_CODE = 2007

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

const VICTIM_SURCHARGE_CREST_CODES = [
  "COM",
  "COMINST",
  "COMTIME",
  "FD",
  "FDINST",
  "FDTIME",
  "FINE",
  "PC",
  "PCINST",
  "PCTIME"
]
const VICTIM_SURCHARGE_AMOUNT_IN_POUNDS = 15
const GUILTY_OF_ALTERNATIVE = "NA"
const PNC_DISPOSAL_TYPE = {
  VICTIM_SURCHARGE: 3117,
  GUILTY_OF_ALTERNATIVE: 2060
}

export enum ResultClass {
  ADJOURNMENT = "Adjournment",
  ADJOURNMENT_WITH_JUDGEMENT = "Adjournment with Judgement",
  JUDGEMENT_WITH_FINAL_RESULT = "Judgement with final result",
  UNRESULTED = "Unresulted",
  SENTENCE = "Sentence",
  ADJOURNMENT_POST_JUDGEMENT = "Adjournment post Judgement",
  ADJOURNMENT_PRE_JUDGEMENT = "Adjournment pre Judgement"
}

const ADJOURNMENT_RANGES = [
  [4001, 4009],
  [4011, 4017],
  [4020, 4021],
  [4023, 4025],
  [4027, 4035],
  [4046, 4048],
  [4050, 4050],
  [4051, 4051],
  [4053, 4058],
  [4506, 4506],
  [4508, 4508],
  [4541, 4572],
  [4574, 4574],
  [4587, 4589]
]
const WARRANT_ISSUED_CODES = [[4575, 4577]]
const ADJOURNMENT_NO_NEXT_HEARING_RANGES = [[0, 0]]
const RESULT_CLASS_PLEAS = ["ADM"]
const RESULT_CLASS_VERDICTS = ["NG", "NC", "NA"]
const RESULT_CLASS_RESULT_CODES = [
  // eslint-disable-next-line prettier/prettier
  2050, 2063, 4010, 1016, 2053, 2060, 2065, 1029, 1030, 1044, 2006,
  // eslint-disable-next-line prettier/prettier
  3047, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 3109, 3110,
  // eslint-disable-next-line prettier/prettier
  3111, 3126, 3127, 3128, 3129, 3130, 3131, 3146, 3147, 3148, 3272
]
const NON_RECORDABLE_RESULT_CODES = [
  // eslint-disable-next-line prettier/prettier
  1000, 1505, 1509, 1510, 1511, 1513, 1514, 2069, 2501, 2505, 2507,
  // eslint-disable-next-line prettier/prettier
  2508, 2509, 2511, 2514, 3501, 3502, 3503, 3504, 3508, 3509, 3510,
  // eslint-disable-next-line prettier/prettier
  3512, 3514, 4049, 4505, 4507, 4509, 4510, 4532, 4534, 4544, 4584,
  // eslint-disable-next-line prettier/prettier
  4585, 4586, 3118, 4592, 4593, 4594, 4595, 4596, 4597
]
const SUSPENDED_2ND_DURATION_RESULTS = [1115, 1134]
const SUSPENDED = "Suspended"
const DURATION_UNITS = {
  SESSIONS: "S",
  HOURS: "H"
}
const DURATION_TYPES = {
  DURATION: "Duration"
}
const RESULT_PENALTY_POINTS = 3008
const RESULT_CURFEW1 = 1052
const RESULT_CURFEW2 = 3105

export {
  ENTERED_IN_ERROR_RESULT_CODE,
  STOP_LIST,
  COMMON_LAWS,
  INDICTMENT,
  DONT_KNOW_VALUE,
  ADJOURNMENT_SINE_DIE_RESULT_CODE,
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
  CROWN_COURT,
  VICTIM_SURCHARGE_CREST_CODES,
  VICTIM_SURCHARGE_AMOUNT_IN_POUNDS,
  GUILTY_OF_ALTERNATIVE,
  PNC_DISPOSAL_TYPE,
  ADJOURNMENT_RANGES,
  WARRANT_ISSUED_CODES,
  ADJOURNMENT_NO_NEXT_HEARING_RANGES,
  RESULT_CLASS_PLEAS,
  RESULT_CLASS_VERDICTS,
  RESULT_CLASS_RESULT_CODES,
  NON_RECORDABLE_RESULT_CODES,
  SUSPENDED_2ND_DURATION_RESULTS,
  SUSPENDED,
  DURATION_UNITS,
  DURATION_TYPES,
  RESULT_PENALTY_POINTS,
  RESULT_CURFEW1,
  RESULT_CURFEW2
}
