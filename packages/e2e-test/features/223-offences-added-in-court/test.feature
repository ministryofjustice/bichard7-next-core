Feature: {223} BR7-R5.5-RCD576-PNC_Adj-Existing_Offences_Adj_Post_Judg-Offence_Added_Adj_Pre_Judg

			"""
			{223} BR7-R5.5-RCD576-PNC_Adj-Existing_Offences_Adj_Post_Judg-Offence_Added_Adj_Pre_Judg
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offences Added in Court behaviour as follows:
			Current PNC Status = Adjudication exists
			Existing Offences are resulted as: Adjournment Post Judgement
			An Offence Added in Court is resulted as: Adjournment Pre Judgement
			The Offence Added in Court cannot be added to the PNC so a Trigger is generated instead.
			The PNC is otherwise successfully updated with Court Hearing Results.

			MadeTech Definition:
			Validating offences added in court behaviour
			"""

	Background:
		Given the data for this test is in the PNC

	@Could
	@NextUI
	Scenario: Validating offences added in court behaviour
		Given "input-message-1" is received
			And I wait "2" seconds
			And "input-message-2" is received
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PS11 - Add offence to PNC" in the exception list table
			And there are no exceptions
			And the PNC updates the record
