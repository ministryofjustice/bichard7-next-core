Feature: {152} BR7 R5.2.2-RCD518 - 2xResult Code Only - NG - Final Result

			"""
			{152} BR7 R5.2.2-RCD518 - 2xResult Code Only - NG - Final Result
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Breach Trigger generation.
			"Not Guilty" Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			An Exception is generated since the Offence contains only Results which cannot be used to update the PNC (i.e.
			the Results are all in the ResultCode StopList) An Offence-level Pre Update Trigger is also generated based on the ResultCodes received (i.e.
			the Breach Trigger is only created once per Offence irrespective of the number of matching conditions encountered).

			MadeTech Definition:
			Breach trigger generation with exceptions
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Breach trigger generation with exceptions
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR20 - Breach" in the exception list table
			And I see exception "HO200212" in the exception list table
			And the PNC record has not been updated
