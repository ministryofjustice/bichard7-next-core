Feature: {315} BR7 R5.11-RCD528 - 2060_No PNC update for 2063 result only

			"""
			{315} BR7 R5.11-RCD528 - 2060_No PNC update for 2063 result only
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the change made to 2060 disposal with a 2063 result where  PNC updated for 2060 result, Offence added in court, TRPS0010 produced.
			No PNC update is generated for result code 2063 where No other result is present on same offence

			MadeTech Definition:
			2060 No PNC update for 2063 result
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: 2060 No PNC update for 2063 result
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PS10 - Offence added to PNC" in the exception list table
			And there are no exceptions
			And the PNC updates the record
