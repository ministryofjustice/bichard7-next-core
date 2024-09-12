Feature: {075} R4.0_BR7_Personal Details Trigger

			"""
			{075} R4.0_BR7_Personal Details Trigger
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Ignored Results handling, Exception generation and Exception resubmission via the Portal.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			Exception is created, displayed and resolved on the Portal via data update and record resubmission.
			PNC Exception Update is generated and the Court Hearing Results with portal-revised values (ASN) are successfully added onto the PNC.
			Specific Result Codes are stripped out of the update to the PNC (4592) and Pre Update Triggers are also generated.

			MadeTech Definition:
			Revising ASN on the UI and removing specific result codes
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	@NextUI
	Scenario: Revising ASN on the UI and removing specific result codes
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO100206" in the exception list table
			And I see trigger "PR15 - Personal details changed" in the exception list table
		When I open the record for "DETAILSTRIG PERSONAL"
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000410830N"
			And I submit the record
		Then the PNC updates the record
		Then I see trigger "PR15 - Personal details changed" in the exception list table
