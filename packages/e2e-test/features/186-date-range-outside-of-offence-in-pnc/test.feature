Feature: {186} BR7 R5.3-RCD494 - No Date Match

			"""
			{186} BR7 R5.3-RCD494 - No Date Match
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Matching and approximate Date Matching with multiple instances of the same result.
			Specifically:
			Where multiple Offences match on Offence and Result but the Date Range of the Court Offence data is outside of the Offence Date Range on PNC the solution will generate an Exception.

			MadeTech Definition:
			Exception is generated when the Court Offence data date range is outside of the Offence date range in PNC
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	@NextUI
	Scenario: Exception is generated when the Court Offence data date range is outside of the Offence date range in PNC
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
		Then I see exception "HO100304" in the exception list table
			And there are no triggers raised for "Ripley Charles"
			And the PNC record has not been updated
