Feature: {021} R3_BR7_SC_001_Mismatch Between Offences_Adjournment with Judgement

      """
      {021} R3_BR7_SC_001_Mismatch Between Offences_Adjournment with Judgement
      ===============
      Q-Solution Definition:
      A Bichard7 Regression Test verifying Offence Matching and Exception generation.
      Court Hearing results are sent through the CJSE and onto Bichard7.
      Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
      PNC Update is NOT generated as the solution recognises a mismatch between those Offences received from Court and those on the PNC - in this case not all Offences received from Court match those held against the Impending Prosecution Record on the PNC.
      An Exception is also successfully created.

      MadeTech Definition:
      This tests that an exception is raised when there is a mismatch between the incoming message and the PNC data

      Note:
      Test script says: 3x HO100300 - Organisation not recognised. Are also present on the portal 1 per offence
      Q Solution have verified that it is not necessary to check for these exceptions - main point is to check for a HO100304
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @Must
  @Parallel
  Scenario: Exception is raised when there is a data mismatch
    Given I am logged in as "generalhandler"
      And I view the list of exceptions
    Then I see exception "HO100304" for this record in the exception list
    When I open this record
      And I click the "Offences" tab
      And I view offence "1"
    Then I see error "HO100300" in the "Next Hearing location" row of the results table
    When I click the "Offences" tab
      And I view offence "2"
    Then I see error "HO100300" in the "Next Hearing location" row of the results table
    When I click the "Offences" tab
      And I view offence "2"
    Then I see error "HO100300" in the "Next Hearing location" row of the results table
    When I click the "Defendant" tab
    Then I see error "HO100304" in the "ASN" row of the results table
      And the PNC record has not been updated
