Feature: Next Hearing Date Not Found Bichard UI

      """
      Next Hearing Date Not Found in Bichard - HO100322
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  Scenario: No next hearing date
    Given I am logged in as "supervisor"
      And I view the list of exceptions
    Then I see exception "HO100322" in the exception list table
    When I open the record for "Harp Nigel"
      And I click the "Offences" tab
      And I view offence "2"
      And I correct "Next Hearing location" to "B01EF01"
      And I correct "Next Hearing date" to "08/10/2011"
    Then I submit the record
      And the PNC updates the record
