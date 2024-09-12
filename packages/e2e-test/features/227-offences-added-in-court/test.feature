Feature: {227} BR7-R5.5-RCD576-PNC_Adj-Existing_Offences_Sentence-Offence_Added_Adj_With_Judg

			"""
			{227} BR7-R5.5-RCD576-PNC_Adj-Existing_Offences_Sentence-Offence_Added_Adj_With_Judg
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offences Added in Court behaviour as follows:
			Current PNC Status = Adjudication exists
			Existing Offences are resulted as: Sentence
			An Offence Added in Court is resulted as: Adjournment With Judgement
			It is not possible to combine SENDEF & NEWREM & DISARR messages in the same transaction for a single CCR Group and an Exception is generated to highlight the need for a manual resolution.
			No Triggers are generated either.

			MadeTech Definition:
			Validating offences added in court behaviour
			"""

	Background:
		Given the data for this test is in the PNC

	@Could
	@NextUI
	Scenario: Validating offences added in court behaviour
		Given I am logged in as "supervisor"
			And "input-message-1" is received
			And I wait "3" seconds
			And "input-message-2" is received
			And I view the list of exceptions
		Then I see exception "HO200113" in the exception list table
			And there are no triggers raised for "ADDEDOFFENCESENTENCE Pncadj"
			And the PNC updates the record
