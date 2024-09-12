Feature: {217} BR7 R5.4-RCD517-TRPR0003 conditions-Youth Rehabilitation Orders

			"""
			{217} BR7 R5.4-RCD517-TRPR0003 conditions-Youth Rehabilitation Orders
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Hearing Results automation, Youth Rehabilitation Orders and Curfew Requirement handling.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The PNC is successfully updated to reflect the results from Court and the solution ensures that only the Duration value of the Curfew Requirement is added to the PNC.
			The solution also generates a number of "Order Issues" Triggers based on the Results received from Court (i.e.
			the combination of a "Youth Rehabilitation Order" Result and a specific "Requirement" Result is received for an Offence).

			MadeTech Definition:
			Youth Rehabilitation Orders and Curfew Requirement handling
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	@NextUI
	Scenario: Youth Rehabilitation Orders and Curfew Requirement handling
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PR03 - Order issues" in the exception list table
			And I see trigger "PS08 - Curfew order" in the exception list table
		When I open the record for "Rehaborders Youth"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0003" for offence "1"
			And I see trigger "TRPR0003" for offence "3"
			And I see trigger "TRPS0008" for offence "1"
			And I see trigger "TRPS0008" for offence "3"
