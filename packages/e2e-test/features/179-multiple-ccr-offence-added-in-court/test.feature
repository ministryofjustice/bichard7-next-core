Feature: {179} BR7 R5.3-RCD496 - Multiple CCR group offence added in court_Judgement Final Result

			"""
			{179} BR7 R5.3-RCD496 - Multiple CCR group offence added in court_Judgement Final Result
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying multiple CCR Group Results automation where Offences are Added In Court and 1 of the CCR Groups has an Adjudication.
			Specifically:
			The following Results are received from Court for an Impending Prosecution Record comprising 3 CCR Groups
			- Message 1: All Offences for CCR Groups 1 & 2 = Judgement With Final Result,
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			Pre Update Triggers are created on the Portal.
			- Message 2: All Offences for CCR Group 3 = Judgement With Final Result, Offence also Added In Court
			The solution recognises that the Offence Added In Court should only be added to the CCR Group without an Adjudication.
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC (including the Offence Added In Court).
			Pre and Post Update Triggers are created on the Portal.

			MadeTech Definition:
			Multiple CCR groups and offence added in court
			"""

	Background:
		Given the data for this test is in the PNC

	@Could
	@NextUI
	Scenario: Multiple CCR groups and offence added in court
		Given "input-message-1" is received
			And I wait "2" seconds
			And "input-message-2" is received
			And I am logged in as "generalhandler"
		Then the PNC updates the record
		When I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And I see trigger "PS10 - Offence added to PNC" in the exception list table
