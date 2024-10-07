Feature: {181} BR7 R5.3-RCD496 - Multiple CCR group offence added in court_Adj pre Judgement

			"""
			{181} BR7 R5.3-RCD496 - Multiple CCR group offence added in court_Adj pre Judgement
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying multiple CCR Group Results automation where Offences are Added In Court and that Offence has no Adjudication.
			Specifically:
			The following Results are received from Court for an Impending Prosecution Record comprising 3 CCR Groups
			- Message 1: All Offences for CCR Groups 1 & 2 = Judgement With Final Result
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			Pre Update Triggers are created on the Portal.
			- Message 2: All Offences for CCR Group 3 = Adjournment Pre Judgement, Offences also Added In Court
			Offences Added In Court can only be added to a CCR Group without an Adjudication and at the point that Adjudication is received for the Offence itself.
			Since this is not the case the Offence Added In Court is not added to the PNC.
			PNC Update is otherwise generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			A Post Update Trigger (to identify the requirement to manually add the Offence Added In Court to the PNC) is created on the Portal.

			MadeTech Definition:
			Multiple CCR groups and offence added in court with no adjudication
			"""

	Background:
		Given the data for this test is in the PNC

	@Could
	@NextUI
	Scenario: Multiple CCR groups and offence added in court with no adjudication
		Given I am logged in as "generalhandler"
			And "input-message-1" is received
		When I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
		When "input-message-2" is received
		Then the PNC updates the record
			And I see trigger "PS11 - Add offence to PNC" in the exception list table
