Feature: {089} R4.1.1_BR7_Court Location from Text Exception

      """
      {089} R4.1.1_BR7_Court Location from Text Exception
      ===============
      Q-Solution Definition:
      A Bichard7 Regression Test verifying the extraction of Next Hearing information from Result Text and Exception generation.
      Court Hearing results are sent through the CJSE and onto Bichard7.
      Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
      The solution recognises that no structured Next Hearing information is provided and attempts to extract the Next Hearing details from the Result Text in the Court Hearing Results.
      However, the Court name is not recognised and so an Exception is created to highlight this on the Portal.
      PNC Update is NOT generated.

      MadeTech Definition:
      Raising an exception if the court location is not found
      """

  Background:
    Given the data for this test is in the PNC
      And "input-message" is received

  @Should @NextUI
  Scenario: Updating the PNC with the court location from Text Exception
    Given I am logged in as "supervisor"
      And I view the list of exceptions
    Then I see exception "HO100322" in the exception list table
      And there are no triggers raised for "Harp Nigel"
      And the PNC record has not been updated
