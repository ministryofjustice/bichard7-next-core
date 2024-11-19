Feature: {418} If the user signs out or the session is ended return to case list

			"""
			The case list remembers the filters after sign out.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@NextUI
	@ExcludeOnLegacyUI
	Scenario: The case list remembers the filters
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100206" in the exception list table
			And I search for exceptions
			And I see applied filters
			And I sign out
		Then I am logged in as "supervisor" in the same window
			And I see exception "HO100206" in the exception list table
			And I see applied filters
