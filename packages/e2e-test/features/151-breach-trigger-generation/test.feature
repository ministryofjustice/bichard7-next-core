Feature: {151} BR7 R5.2.2-RCD518 - 2xResult Code Only - Final Result

			"""
			{151} BR7 R5.2.2-RCD518 - 2xResult Code Only - Final Result
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Breach Trigger generation and Results automation (Judgement With Final Result).
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Verification is made of the "Guilty" Breach updates to the PNC.
			An Offence-level Pre Update Trigger is also generated based on the ResultCodes received (i.e.
			the Breach Trigger is only created once per Offence irrespective of the number of matching conditions encountered).

			MadeTech Definition:
			Breach trigger generation
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Breach trigger generation
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR20 - Breach" in the exception list table
			And there are no exceptions raised for "Seagull Martin"
			And the PNC updates the record
