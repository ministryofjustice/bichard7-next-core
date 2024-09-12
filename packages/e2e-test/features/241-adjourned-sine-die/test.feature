Feature: {241} BR7 R5.6-RCD469-Sine Die No Conviction Date from Court

			"""
			{241} BR7 R5.6-RCD469-Sine Die No Conviction Date from Court
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation of Adjourned Sine Die results where no Conviction Date is received from Court.
			Court Hearing results are sent through the CJSE and onto Bichard7 containing Adjourned Sine Die results where no Conviction Date has been set/specified by the Court.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The Bichard7 solution recognises that no Conviction Date is present and therefore sets the Conviction Date to be the same value as the Date of the Hearing.
			The Court Hearing Results are successfully added automatically onto the PNC.

			MadeTech Definition:
			Adjourned Sine Die results with no conviction date
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Adjourned Sine Die results with no conviction date
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then there are no exceptions raised for "PICADILLUS THETUBE"
			And I see trigger "PR23 - Domestic violence" in the exception list table
		When I open the record for "AdjSineDie NoConvictionDate"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0017" for offence "1"
			And I see trigger "TRPR0017" for offence "2"
			And I see trigger "TRPR0017" for offence "3"
			And I see trigger "TRPR0023"
			And the PNC updates the record
