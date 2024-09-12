Feature: {057} #192 - Result Date

			"""
			{057} #192 - Result Date
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation (Judgement with Final Result), updating the PNC with Result Text and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7 for a number of Orders Results.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results (Result Codes 1100,1116,3025,3041) are successfully added automatically onto the PNC which include a number of specific updates to PNC Disposal Text.
			Pre Update Triggers are also successfully created on the Portal.

			MadeTech Definition:
			Validating judgement with final result automation
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Validating judgement with final result automation
		Given I am logged in as "supervisor"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PS03 - Disposal text truncated" in the exception list table
		When I open the record for "Anchovy Adam"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0003" for offence "2"
			And I see trigger "TRPR0003" for offence "3"
			And I see trigger "TRPR0021" for offence "2"
			And I see trigger "TRPS0003" for offence "2"
			And I see trigger "TRPS0003" for offence "3"
			And I see trigger "TRPR0006"
