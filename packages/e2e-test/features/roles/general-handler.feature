Feature: General handler permissions

  General handlers can:
  - view and update exceptions and triggers
  - reallocate exceptions to another force area

  Background: Logging in
    Given there is a valid record for "Rigout Dean" in the PNC
      And "input-message" is received
      And I am logged in as "generalhandler"
    When I view the list of exceptions

  @ExcludedOnConductor
  Scenario: General handler can see triggers
    Then I see trigger "PR10 - Conditional bail" in the exception list table
      And I see exception "HO100300" in the exception list table

  Scenario: General handlers can handle exceptions
      And I open the record for "Rigout Dean"
    Then I can correct the exception

  Scenario: General handlers can handle triggers
      And I open the record for "Rigout Dean"
    Then the "Triggers" menu item is visible

  Scenario: General handlers can reallocate cases to another force area
      And I open the record for "Rigout Dean"
    Then I can reallocate the case to another force area
