Feature: {131} BR7 R5.1.3-RCD467-Single CCR-SENDEF-NEWREM - part 2

			"""
			{131} BR7 R5.1.3-RCD467-Single CCR-SENDEF-NEWREM
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying NEWREM & SENDEF combinations.
			These PNC Message Types are not compatible for a single CCR Group but they can be used to update separate CCR Groups.
			Specifically, for a single CCR Group:
			- Message 1: Offences Adjourned with/without Judgement (NEWREM & DISARR)
			- Message 2: Offences Adjourned without Judgement, Offence Sentenced (NEWREM, SENDEF)
			Message 2 produces a successful update to the PNC (NEWREM and SENDEF) since the Offences without a Judgement will now actually reside in a separate CCR Group to the Offence with an Adjudication
			- Message 3: All Offences Adjourned with Judgement (NEWREM & DISARR)
			- Message 4: Offences Adjourned Post Judgement, Offence Sentenced (NEWREM, SENDEF)
			All Offences reside in the same CCR Group at this point and therefore the potential update to the PNC (NEWREM and SENDEF) is not possible.
			Message 4 creates an Exception.
			Pre Update Triggers are also created.

			MadeTech Definition:
			Verifying SENDEF and NEWREM combinations in PNC updates
			"""

	Background:
		Given the data for this test is in the PNC

	@Should @NextUI
	Scenario: Verifying SENDEF and NEWREM combinations in PNC updates
		Given "input-message-1" is received
			And I am logged in as "generalhandler"
			And I view the list of exceptions
		Then there are no exceptions raised for "SENDNEW ONECCR"
		When "input-message-2" is received
		Then I see exception "HO200113" in the exception list table
			And I see trigger "PR06 - Imprisoned" in the exception list table
			And the PNC updates the record
