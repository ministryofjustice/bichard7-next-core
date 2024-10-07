Feature: {001} R3_BR7_TR_003_TRPR0004

			"""
			{001} R3_BR7_TR_003_TRPR0004
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation (Judgement with Final Result) and Trigger generation (on qualifying Offences as well as their 'ABCI' variants).
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Pre Update Triggers are also successfully created on the Portal and manually resolved.

			MadeTech Definition:
			Ensure that sexual offence triggers an updates are correctly creates
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@NextUI
	Scenario: Updates and triggers are correctly generated for sexual offences
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		When I open this record
			And I click the "Triggers" tab
		Then I see trigger "TRPR0003" for offence "1"
			And I see trigger "TRPR0004" for offence "1"
			And I see trigger "TRPR0004" for offence "2"
			And the PNC updates the record
		When I resolve all of the triggers
		Then this "record" is "resolved"
			And this "record" is not "unresolved"
			And there are no exceptions for this record
