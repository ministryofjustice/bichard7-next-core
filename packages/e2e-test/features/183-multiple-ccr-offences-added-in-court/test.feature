Feature: {183} BR7 R5.3-RCD496 - Multiple CCR group offence added in court_2nd Judgement Final Result

			"""
			{183} BR7 R5.3-RCD496 - Multiple CCR group offence added in court_2nd Judgement Final Result
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying multiple CCR Group Results automation where Offences are Added In Court and no unresulted CCR Group has an Adjudication.
			Specifically:
			The following Results are received from Court for an Impending Prosecution Record comprising 2 CCR Groups
			- Message 1: All Offences for CCR Group 1 = Adjournment With Judgement, All Offences for CCR Group 2 = Adjournment Pre Judgement
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			- Message 2: All Offences for CCR Group 1 = Sentence, All Offences for CCR Group 2 = Adjournment Pre Judgement & Offence also Added In Court (Judgement With Final Result)
			Offences Added In Court can only be added to a CCR Group without an Adjudication and at the point that Adjudication is received for the Offence itself.
			Since this is the case (i.e.
			the 1x remaining CCR Group has no Offences with an Adjudication) the Offence Added In Court can be added to the PNC.
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC (including the Offence Added In Court).
			Pre and Post Update Triggers are also created on the Portal.

			MadeTech Definition:
			Multiple CCR groups and offences added in court
			"""

	Background:
		Given the data for this test is in the PNC

	@Could
	@NextUI
	Scenario: Multiple CCR groups and offences added in court
		Given I am logged in as "generalhandler"
			And "input-message-1" is received
		When I view the list of exceptions
		Then there are no triggers raised for "Liverpool Martin"
		When "input-message-2" is received
		Then the PNC updates the record
			And I see trigger "PR06 - Imprisoned" in the exception list table
			And I see trigger "PS10 - Offence added to PNC" in the exception list table
