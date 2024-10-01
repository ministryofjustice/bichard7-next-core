Feature: {279} BR7 R5.8-RCD638 - TRPR0029 - Civil & Non-Civil Offences

			"""
			{279} BR7 R5.8-RCD638 - TRPR0029 - Civil & Non-Civil Offences
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies the handling of Civil Cases by the Bichard7 solution.
			Court Hearing results containing Civil and Non-Civil Offences are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			An Exception is generated as a result of the incompatible (but valid) combination of Civil (Non-Recordable) & Criminal (Recordable) Offences that have been received from Court.
			No update is therefore made to the PNC.
			Since the Civil Offence Results cannot meet the conditions for the Civil Proceedings Trigger the TRPR0029 Trigger is not generated.
			Other Pre Update Triggers are generated as part of the processing for this Case.

			MadeTech Definition:
			Handling civil offences

			Currently this is raising an "HO200111 - Unknown order varied/revoked result code" exception but shouldn't be
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Handling civil offences
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And I see trigger "PR20 - Breach" in the exception list table
			And there are no exceptions raised for "CIVILCASE RECANDNONREC"
			And the PNC updates the record
