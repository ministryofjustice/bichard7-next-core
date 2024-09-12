Feature: {068} R3.5_BR7_CCR Group Matching-Offence Added In Court-Offence in CCR 1

			"""
			{068} R3.5_BR7_CCR Group Matching-Offence Added In Court-Offence in CCR 1
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Multiple CCR Group handling and Exception generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is NOT generated as the solution recognises that 3x CCR Groups (a limitation with the PNC interface) are present on the PNC.
			An Exception is successfully created and Pre Update Triggers are also generated.

			MadeTech Definition:
			Handles PNC errors with 3 CCR groups
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@PreProdTest
	Scenario: Handles PNC errors with 3 CCR groups
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO100314" in the exception list table
			And I see trigger "PR06 - Imprisoned" in the exception list table
			And the PNC record has not been updated
		When I open the record for "LOMAX DAVID"
			And I click the "PNC Errors" tab
		Then I see "I1008 - GWAY - ENQUIRY ERROR MORE THAN 3 DISPOSAL GROUPS 09/0000/00/20004H" in the "Error" row of the results table
