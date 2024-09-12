Feature: {244} BR7 R5.6-RCD592-Witness Warrant-4586

			"""
			{244} BR7 R5.6-RCD592-Witness Warrant-4586
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Witness Warrant handling.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			An Exception is generated since the Offences contain only Results which cannot be used to update the PNC (i.e.
			the Results are all in the ResultCode StopList) A Case-level Pre Update Trigger is also generated based on the ResultCodes received (i.e.
			the Warrant Issued Trigger is only created once per Case irrespective of the number of matching conditions encountered).

			MadeTech Definition:
			Handling witness warrants
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Handling witness warrants
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO200212 (2)" in the exception list table
			And I see trigger "PR02 - Warrant issued" in the exception list table
			And the PNC record has not been updated
