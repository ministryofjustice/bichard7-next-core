Feature: {019} R3_BR7_PU_005_Identical Results Update

      """
      {019} R3_BR7_PU_005_Identical Results Update
      ===============
      Q-Solution Definition:
      A Bichard7 Regression Test verifying Court Results automation (Judgement with Final Result), identical results handling and Trigger generation.
      Court Hearing results are sent through the CJSE and onto Bichard7.
      Each Offence is identical as are the results for each one.
      Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
      PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.

      MadeTech Definition:
      This tests that an exception is raised when there is a mismatch between the incoming message and the PNC data
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @Must
  @Parallel
  @NextUI
  Scenario: PNC is updated when there are multiple identical results
    Given I am logged in as "supervisor"
      And I view the list of exceptions
    Then the PNC updates the record
      And there are no exceptions or triggers for this record
