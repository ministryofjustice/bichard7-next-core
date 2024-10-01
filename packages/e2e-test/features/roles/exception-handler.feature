Feature: Exception handler permissions

  Exception handlers can:
  - view and update exceptions
  - reallocate exceptions to another force area

  Background: Logging in
    Given there is a valid record for "Rigout Dean" in the PNC
      And "input-message" is received
      And I am logged in as "exceptionhandler"
    When I view the list of exceptions

  @ExcludedOnConductor
  Scenario: Exception handler can see exceptions
    Then I see exception "HO100300" in the exception list table
      And I cannot see "TRPR0010" in the exception list table

  Scenario: Exception handlers can handle exceptions
      And I open the record for "Rigout Dean"
    Then I can correct the exception

  Scenario: Exception handlers cannot see triggers
      And I open the record for "Rigout Dean"
    Then the "Triggers" menu item is not visible

  Scenario: Exception handlers can reallocate cases to another force area
      And I open the record for "Rigout Dean"
    Then I can reallocate the case to another force area
