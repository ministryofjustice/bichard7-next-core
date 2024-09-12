Feature: {128} BR7 R5.1-RCD411-No Offence End Dates-Start Dates do not match

			"""
			{128} BR7 R5.1-RCD411-No Offence End Dates-Start Dates do not match
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Code Matching where both PNC and Court Offences have no End Dates AND PNC and Court Offence Start Dates do not match.
			Specifically:
			- Whilst the Offence Codes are valid there are no End Dates associated with the PNC Offences or the Court Offences.
			In addition the Court and PNC Offence Start Date values do not match.
			Therefore no update is applied and instead an Exception is generated

			MadeTech Definition:
			Exception is raised when start dates do not match
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Exception is raised when start dates do not match
		Given I am logged in as "supervisor"
			And I see exception "HO100304" in the exception list table
			And there are no triggers raised for "ENDDATES NOOFFENCE"
			And the PNC record has not been updated
