Feature: {007} R3_BR7_TR_002_Date

			"""
			{007} R3_BR7_TR_002_Date
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Split Adjournment Court Results automation (Adjournment Pre Judgement), Result Code Transformation and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			CJS Result Code “4506” is transformed to a “2059” PNC Disposal in order for PNC to accept the update from Magistrates Court.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			A Post Update Trigger is also successfully created on the Portal and manually resolved.

			MadeTech Definition:
			Split adjournment court results automation
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@NextUI
	Scenario: Split adjournment court results automation
		Given I am logged in as "supervisor"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PS04 - Split adjournment" for this record in the exception list
		When I open this record
			And I click the "Triggers" tab
			And I resolve all of the triggers
		Then this "record" is "resolved"
			And this "record" is not "unresolved"
