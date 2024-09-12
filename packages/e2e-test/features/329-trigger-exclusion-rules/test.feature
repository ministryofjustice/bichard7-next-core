Feature: R3_BR7_TI_001 (Trigger Exclusion-ALL) - This needs a code

			"""
			R3_BR7_TI_001 (Trigger Exclusion-ALL) - This needs a code
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Portal View Filter behaviour.
			This Test confirms that specific Triggers can/cannot be viewed based on a user's "inclusion" and "exclusion" list confiuration.

			MadeTech Definition:
			Testing trigger exclusion rules for a user
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Must @NextUI
	Scenario: Testing trigger exclusion rules for a user
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR03 - Order issues" in the exception list table
			And I see trigger "PR06 - Imprisoned" in the exception list table
		When I am logged in as "trigger.fivefourexcl"
			And I view the list of exceptions
		Then I cannot see trigger "PR03 - Order issues" in the exception list table
			And I cannot see trigger "PR06 - Imprisoned" in the exception list table
		When I am logged in as "general.handlerexclone"
			And I view the list of exceptions
		Then I see trigger "PR03 - Order issues" in the exception list table
			And I cannot see trigger "PR06 - Imprisoned" in the exception list table
			And the PNC updates the record
