Feature: Trigger handler permissions

  Trigger handlers can:
  - view and update triggers
  - reallocate exceptions to another force area

  Background: Logging in
    Given there is a valid record for "Rigout Dean" in the PNC
      And "input-message" is received
      And I am logged in as "triggerhandler"
    When I view the list of exceptions

  Scenario: Trigger handler can see triggers
    Then I see trigger "PR10 - Conditional bail" in the exception list table
      And I cannot see "HO100300" in the exception list table

  Scenario: Trigger handlers cannot handle exceptions
      And I open the record for "Rigout Dean"
    Then I cannot correct the exception

  Scenario: Trigger handlers can handle triggers
      And I open the record for "Rigout Dean"
    Then the "Triggers" menu item is visible

  Scenario: Trigger handlers cannot reallocate cases to another force area
      And I open the record for "Rigout Dean"
    Then I cannot reallocate the case to another force area
