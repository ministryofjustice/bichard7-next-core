Feature: Audit role

  Auditors can view resolved and unresolved exceptions/triggers, but they cannot update them. (i.e. read-only access)

  @ExcludedOnConductor
  Scenario: Auditors have read only access
    Given there is a valid record for "Rigout Dean" in the PNC
      And "input-message" is received
      And I am logged in as "auditor"
    When I view the list of exceptions
      And I open the record for "Rigout Dean"
    Then I can see exceptions
      And I can see triggers
      And I cannot make any changes
