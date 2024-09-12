Feature: {182} BR7 R5.3-RCD496 - No HO100332 for offences added in court

			"""
			{182} BR7 R5.3-RCD496 - No HO100332 for offences added in court
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying multiple CCR Group Results automation where Offences are Added In Court and should not be added to the PNC.
			Specifically:
			The following Results are received from Court for an Impending Prosecution Record comprising 3 CCR Groups
			- Message 1: All Offences for CCR Groups 1 & 2 = Judgement With Final Result, Offence also Added In Court
			The solution recognises that the Offence Added In Court is in the DoNotAddToPNCCategory and is therefore stripped from the update to the PNC.
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			Pre Update Triggers are created on the Portal.

			MadeTech Definition:
			No HO100332 for offences added in court
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: No HO100332 for offences added in court
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And there are no exceptions raised for "Manchester Martin"
			And the PNC updates the record
