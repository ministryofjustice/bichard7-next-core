Feature: {171} BR7 R5.3-RCD513 - Stop List Offence added in court - 4583

			"""
			{171} BR7 R5.3-RCD513 - Stop List Offence added in court - 4583
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Ignored Offences handling (Ignored Offences with Recordable Results) where the Ignored Offence is Added In Court.
			Specifically:
			- Message 1: Offence 1 (Recordable Offence, Stop List Result), Offence 2 Added In Court (Ignored Offence, Recordable Result) = Judgement With Final Result
			An Exception is created since the Offence on the PNC has a Stop Listed Result, leaving the only remaining Offence to match being the Offence Added In Court - which doesn't match the Offence on the PNC.
			Pre Update Triggers are created on the Portal - this includes a Trigger (TRPR0006) for the Recordable Results received against the Ignored Offence.

			MadeTech Definition:
			Stop List Offence added in court
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	Scenario: Stop List Offence added in court
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And I see exception "HO100304" in the exception list table
		When I open the record for "Venger Terry"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0006"
		When I resolve all of the triggers
			And I unlock the record and return to the list
		Then the "trigger" for "Venger Terry" is "resolved"
			And the "trigger" for "Venger Terry" is not "unresolved"
			And the PNC record has not been updated
