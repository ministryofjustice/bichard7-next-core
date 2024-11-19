enum ResolutionStatus {
  READONLY = 4, // Intermediate state when a trigger is unresolved but the current user doesn't handle the trigger. Doesn't get written to the database (from legacy bichard)
  RESOLVED = 2,
  SELECTED = 5, // Intermediate state when the checkbox for a trigger has been selected but the 'Mark Selected As Complete' has not been pressed. Doesn't get written to the database
  SUBMITTED = 3,
  UNRESOLVED = 1
}

export default ResolutionStatus
