Feature: {319} BR7 R5.11-RCD673 -  No PNC update for 3052 result_Adjournment With Judgement

			"""
			{319} BR7 R5.11-RCD673 -  No PNC update for 3052 result_Adjournment With Judgement
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the change made for No update of PNC for 3052 result when present with an adjournment with judgement result.
			Result is still displayed on the Portal and trigger TRPR0004 produced.
			PNC updated with Remand

			MadeTech Definition:
			No PNC update for 3052 result (judgement)
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: No PNC update for 3052 result (judgement)
		Given I am logged in as "supervisor"
			And I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PR04 - Sex offender" in the exception list table
			And there are no exceptions
