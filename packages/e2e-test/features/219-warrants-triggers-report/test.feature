Feature: {219} BR7 R5.5 RCD571-1st Instance Warrant-Undated

			"""
			{219} BR7 R5.5 RCD571-1st Instance Warrant-Undated
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifying Undated 1st Instance Warrants, Result Code Transformation and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7 for a 1st Instance FTA Result WITHOUT Next Hearing information.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			CJS Result Code “4577” is transformed to a “2059” PNC Disposal in order for PNC to accept the update from Magistrates Court.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Pre Update Triggers are also successfully created on the Portal and manually resolved.

			MadeTech Definition:
			Pre-update triggers are created for warrants and appear in the warrants report
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	Scenario: Pre-update triggers are created for warrants and appear in the warrants report
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR02 - Warrant issued" in the exception list table
			And there are no exceptions raised for "UNDATED Fta"
			And the PNC updates the record
		When I open the record for "UNDATED Fta"
			And I click the "Triggers" tab
			And I resolve all of the triggers
		Then the "record" for "UNDATED Fta" is "resolved"
			And the "record" for "UNDATED Fta" is not "unresolved"
		When I navigate to the list of reports
			And I access the "Warrants" report
			And I generate today's report
		Then I see "01ZD0307708" in the Warrants report
