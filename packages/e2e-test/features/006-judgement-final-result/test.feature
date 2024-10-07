Feature: {006} R3_BR7_TR_003_TRPS0002

			"""
			{006} R3_BR7_TR_003_TRPS0002
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation (Judgement with Final Result) and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			A Post Update Trigger is also successfully created on the Portal and manually resolved.

			MadeTech Definition:
			This test will generate a trigger for PS02 - Check address and will check that we are able to resolve that trigger
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@NextUI
	Scenario: I can resolve a trigger for check address
		Given I am logged in as "supervisor"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PS02 - Check address" for this record in the exception list
		When I open this record
			And I click the "Triggers" tab
		When I resolve all of the triggers
		Then this "record" is "resolved"
			And this "record" is not "unresolved"
			And there are no exceptions for this record
