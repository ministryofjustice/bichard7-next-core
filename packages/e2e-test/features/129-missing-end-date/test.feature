Feature: {129} BR7 R5.1-RCD411-No PNC Offence End Date

			"""
			{129} BR7 R5.1-RCD411-No PNC Offence End Date
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Code Matching where a Court Offence has an End Date but a PNC Offence does not.
			Specifically:
			- Whilst the Offence Codes are valid there is no End Date associated with one of the PNC Offences.
			Therefore no update is applied and instead an Exception is generated

			MadeTech Definition:
			Exception is raised if end dates are missing
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Exception is raised if end dates are missing
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO100304" in the exception list table
			And there are no triggers raised for "ENDDATE NOPNCOFFENCE"
			And the PNC record has not been updated
