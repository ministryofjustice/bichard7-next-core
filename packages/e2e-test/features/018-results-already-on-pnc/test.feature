Feature: {018} R3_BR7_NX001_Results Already on PNC

			"""
			{018} R3_BR7_NX001_Results Already on PNC
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation (Judgement with Final Result), duplicate results handling and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			A Pre Update Trigger is also successfully created on the Portal.
			A second, identical Court Hearing result (Adjudication and Disposal(s) on the PNC match those in the court result) is sent through the CJSE and onto Bichard7.
			The solution ignores the results (since they are already present on the PNC) and logs the message to the General Event Log.
			A Pre Update Trigger is also successfully created on the Portal.

			MadeTech Definition:
			Handling results when they are already on the PNC
			"""

	Background:
		Given the data for this test is in the PNC

	@Could
	@ExcludedOnConductor
	@NextUI
	Scenario: Handling results when they are already on the PNC
		Given "input-message-1" is received
			And I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And there are no exceptions raised for "NXONE LOG"
		When "input-message-2" is received
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And there are no exceptions raised for "NXONE LOG"
			And the PNC updates the record
