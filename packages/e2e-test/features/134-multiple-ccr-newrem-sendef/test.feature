Feature: {134} BR7 R5.1.3-RCD467 - Multiple CCR-SENDEF-NEWREM

			"""
			{134} BR7 R5.1.3-RCD467 - Multiple CCR-SENDEF-NEWREM
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying NEWREM & SENDEF combinations.
			These PNC Message Types are not compatible for a single CCR Group but they can be used to update separate CCR Groups.
			Specifically, for multiple CCR Groups:
			- Message 1: Offences Adjourned with/without Judgement (NEWREM & DISARR)
			- Message 2: Offences Adjourned without Judgement, Offence Sentenced (NEWREM, SENDEF)
			Message 2 produces a successful update to the PNC (NEWREM and SENDEF) since the Offences without an Adjudication reside in a separate CCR Group to the Offence with an Adjudication
			Pre Update Triggers are also created.

			MadeTech Definition:
			Multiple CCR with newrem and sendef elements
			"""

	Background:
		Given the data for this test is in the PNC

	@Should @NextUI
	Scenario: Multiple CCR with newrem and sendef elements
		Given "input-message-1" is received
			And I wait "2" seconds
			And "input-message-2" is received
			And I am logged in as "generalhandler"
		Then the PNC updates the record
		When I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
