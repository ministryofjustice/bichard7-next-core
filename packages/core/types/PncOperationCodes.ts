enum PncOperationCode {
  NEWREM = "NEWREM",
  DISARR = "DISARR",
  SENDEF = "SENDEF",
  SUBVAR = "SUBVAR",
  PENHRG = "PENHRG",
  COMSEN = "COMSEN",
  APPHRD = "APPHRD"
}

enum PncOperationDescriptions {
  NEWREM = "New Remand",
  DISARR = "Discharge Arranged",
  SENDEF = "Sentence Deferred",
  SUBVAR = "Submission Variation",
  PENHRG = "Pending Hearing",
  COMSEN = "Community Sentence",
  APPHRD = "Appeal Heard"
}

export default { PncOperationCode, PncOperationDescriptions }
