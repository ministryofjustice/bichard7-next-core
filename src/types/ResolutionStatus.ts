enum ResolutionStatus {
  UNRESOLVED = 1,
  RESOLVED = 2,
  SUBMITTED = 3,
  READONLY = 4, // Intermediate state when a trigger is unresolved but the current user doesn't handle the trigger. Doesn't get written to the database (from legacy bichard)
  SELECTED = 5 // Intermediate state when the checkbox for a trigger has been selected but the 'Mark Selected As Complete' has not been pressed. Doesn't get written to the database
}

export default ResolutionStatus
