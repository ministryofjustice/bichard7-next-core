Feature: {013} R3_BR7_EX_001_Extra Offence on PNC

      """
      {013} R3_BR7_EX_001_Extra Offence on PNC
      ===============
      Q-Solution Definition:
      A Bichard7 Regression Test verifying Offence Matching and Exception generation.
      Court Hearing results are sent through the CJSE and onto Bichard7.
      Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
      PNC Update is NOT generated as the solution recognises a mismatch between those Offences received from Court and those on the PNC - in this case there is 1x more Offence on the PNC.
      An Exception is also successfully created and manually resolved via the Portal.

      MadeTech Definition:
      This tests that an exception is raised when there is a mismatch between the incoming message and the PNC data
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @Must
  @Parallel
  Scenario: Exception is raised when there is a data mismatch
    Given I am logged in as "supervisor"
      And I view the list of exceptions
      And I see exception "HO100304" for this record in the exception list
    When I open this record
      And I click the "Triggers" tab
    Then I see trigger "TRPR0006"
    When I manually resolve the record
    Then this "record" is "resolved"
      And this "record" is not "unresolved"
      And the PNC record has not been updated
      And the audit log contains "Exception marked as resolved by user"
