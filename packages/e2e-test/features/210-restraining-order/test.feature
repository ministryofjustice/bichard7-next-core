Feature: {210} BR7 R5.4-RCD550-Undated Restraining Order-3047

			"""
			{210} BR7 R5.4-RCD550-Undated Restraining Order-3047
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Undated Restaining Order handling, Court Results automation and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated including Restraining Order details (Result Code '3047') and the Court Hearing Results are successfully and automatically added onto the PNC.
			The update to the PNC is verified to ensure the PNC Disposal Text states only "until further order".
			Pre Update Triggers are also successfully created on the Portal.

			MadeTech Definition:
			Updating the PNC with a restraining order
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	@NextUI
	Scenario: Updating the PNC with a restraining order
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then there are no exceptions raised for "RESTRAINORDER Undated"
			And I see trigger "PR03 - Order issues" in the exception list table
			And the PNC updates the record
