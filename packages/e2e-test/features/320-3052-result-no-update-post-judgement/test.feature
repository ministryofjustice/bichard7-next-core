Feature: {320} BR7 R5.11-RCD673 -  No PNC update for 3052 result_Adjournment Post Judgement

			"""
			{320} BR7 R5.11-RCD673 -  No PNC update for 3052 result_Adjournment Post Judgement
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the change made for No update of PNC for 3052 result when present with an adjournment post judgement result.
			Result is still displayed on the Portal and trigger TRPR0004 produced.
			HO200113 produced.
			PNC NOT updated

			MadeTech Definition:
			No PNC update for 3052 result (post-judgement)
			"""

	Background:
		Given the data for this test is in the PNC

	@Should @NextUI
	Scenario: No PNC update for 3052 result (post-judgement)
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions raised for "THREEZEROFIVETWO ADJPOSTJUDGE"
			And there are no triggers raised for "THREEZEROFIVETWO ADJPOSTJUDGE"
		When "input-message-2" is received
		Then I see exception "HO200113" in the exception list table
			And I see trigger "PR04 - Sex offender" in the exception list table
			And the PNC updates the record
