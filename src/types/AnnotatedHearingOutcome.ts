import type { HearingOutcome } from "./HearingOutcome"
import type { StringElement } from "./XmlElement"

export interface AnnotatedHearingOutcome {
  HearingOutcome: HearingOutcome
  CXE01?: CXE01
  PNCQueryDate?: string
  HasError?: boolean
}

interface CXE01 {
  GMH: StringElement<GMHAttributes>
  FSC: StringElement<FSCAttributes>
  IDS: StringElement<IDAttributes>
  CourtCases: CourtCases
  GMT: StringElement<GMTAttributes>
}

interface GMTAttributes {
  MessRefNo: string
  SegCount: string
}

interface CourtCases {
  CourtCase: CourtCase[]
}

interface CourtCase {
  CCR: StringElement<CCRAttributes>[]
  Offences: Offences[]
}

interface Offences {
  Offence: Offence[]
}

interface Offence {
  COF: StringElement<COFAttributes>[]
  ADJ: StringElement<ADJAttributes>[]
  DISList: DISList[]
}

interface DISList {
  DIS: StringElement<DIAttributes>[]
}

interface DIAttributes {
  IntfcUpdateType: string
  QtyDate: string
  QtyDuration: string
  QtyMonetaryValue: string
  QtyUnitsFined: string
  Qualifiers: string
  Text: string
  Type: string
}

interface ADJAttributes {
  Adjudication1: string
  DateOfSentence: string
  IntfcUpdateType: string
  OffenceTICNumber: string
  Plea: string
  WeedFlag: string
}

interface COFAttributes {
  ACPOOffenceCode: string
  CJSOffenceCode: string
  IntfcUpdateType: string
  OffEndDate: string
  OffEndTime: string
  OffStartDate: string
  OffStartTime: string
  OffenceQualifier1: string
  OffenceQualifier2: string
  OffenceTitle: string
  ReferenceNumber: string
}

interface CCRAttributes {
  CourtCaseRefNo: string
  CrimeOffenceRefNo: string
  IntfcUpdateType: string
}

interface IDAttributes {
  CRONumber: string
  Checkname: string
  IntfcUpdateType: string
  PNCID: string
}

interface FSCAttributes {
  FSCode: string
  IntfcUpdateType: string
}

interface GMHAttributes {
  MessRefNo: string
  MessType: string
  NID: string
  NSPISUserId: string
  OrigDateTime: string
  Originator: string
  ReasonCode: string
  SyntaxA: string
  TermIdCode: string
  TermIdForce: string
  TermIdSeq: string
  VersionN: string
}
