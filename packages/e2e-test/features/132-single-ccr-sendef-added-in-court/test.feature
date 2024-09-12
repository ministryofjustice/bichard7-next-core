Feature: {132} BR7 R5.1.3-RCD467-Single CCR-SENDEF-Offence Added In Court

			"""
			{132} BR7 R5.1.3-RCD467-Single CCR-SENDEF-Offence Added In Court
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying DISARR & SENDEF combinations.
			These PNC Message Types are not compatible for a single CCR Group.
			Specifically, for a single CCR Group:
			- Message 1: All Offences Adjourned with Judgement (NEWREM & DISARR)
			- Message 2: Offences Sentenced, Offence Added In Court (DISARR, SENDEF)
			All Offences reside in the same CCR Group at this point and therefore the potential update to the PNC DISARR and SENDEF) is not possible.
			The solution instead generates the SENDEF and instead of an Exception creates a Post Update Trigger (TRPS0011) for the Offence Added In Court.
			Pre Update Triggers are also created.

			MadeTech Definition:
			Adding a single CCR SENDEF offence in court
			"""

	Background:
		Given the data for this test is in the PNC

	@Could @NextUI
	Scenario: Adding a single CCR SENDEF offence in court
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
		When "input-message-2" is received
		Then there are no exceptions raised for "SENDEFOFFENCEADDED ONECCR"
			And I see trigger "PS11 - Add offence to PNC" in the exception list table
			And I see trigger "PR06 - Imprisoned" in the exception list table
			And the PNC updates the record
