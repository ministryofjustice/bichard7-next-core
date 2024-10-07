Feature: {318} BR7 R5.11-RCD673 -  No PNC update for 3052 result_Adjournment Pre Judgement

			"""
			{318} BR7 R5.11-RCD673 -  No PNC update for 3052 result_Adjournment Pre Judgement
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the change made for No update of PNC for 3052 result when present with an adjournment pre judgement result.
			Result is still displayed on the Portal and trigger TRPR0004 produced.
			HO100305 Produced.
			PNC NOT updated

			MadeTech Definition:
			No PNC update for 3052 result (pre-judgement)
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: No PNC update for 3052 result (pre-judgement)
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR04 - Sex offender" in the exception list table
			And I see exception "HO100305" in the exception list table
			And the PNC record has not been updated
