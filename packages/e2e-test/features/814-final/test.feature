Feature: {107} BR7 R5.0-RCD352-Fuzzy Offence Matching

      """
      {107} BR7 R5.0-RCD352-Fuzzy Offence Matching
      ===============
      Q-Solution Definition:
      A Bichard7 Regression Test verifying 'fuzzy' Offence matching, Results automation (Judgement with Final Result) and Trigger generation.
      Court Hearing results are sent through the CJSE and onto Bichard7.
      Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
      'Fuzzy' Offence date matching ensures that the Start and End dates for each Offence is considered a match if the date range defined by the start and end dates of the Hearing Outcome offence fall wholly within the date range defined by the start and end dates of the PNC offence.
      PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
      Pre Update Triggers are also generated.

      MadeTech Definition:
      Ensure that dates are correctly matched and that the PNC is updated correctly
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
		  And I see exception "HO100300" in the exception list table
			And I see trigger "PR18" in the exception list table
		When I go to the Case Details for this exception "HO100300"
			And I click the "Offences" tab
			And I view offence with text "Aggravated vehicle taking - ( driver did not take ) and vehicle damage of £5000 or over"
			And I correct "Next Hearing location" and type "Barb"
			And I select the first option
      And I submit the record
		When I return to the list
      When I wait "3000" seconds
			And I reload until I don't see "(Submitted)"

