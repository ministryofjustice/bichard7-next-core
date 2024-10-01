Feature: {044} #151 - FTA Undated Warrant

			"""
			{044} #151 - FTA Undated Warrant
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation (Adjournment Pre Judgement), FTA Result handling and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7 for an FTA Result WITHOUT Next Hearing information.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Pre Update Triggers are also successfully created on the Portal and manually resolved.

			MadeTech Definition:
			Handling FTA results with undated warrant
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	@NextUI
	Scenario: Handling FTA results with undated warrant
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		When I open this record
			And I click the "Triggers" tab
		Then I see trigger "TRPR0002"
		When I resolve all of the triggers
		Then this "record" is "resolved"
			And this "record" is not "unresolved"
			And the PNC updates the record
