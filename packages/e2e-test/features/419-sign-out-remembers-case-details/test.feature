Feature: {419} If the user signs out or the session is ended return to the case details

			"""
			The case details remembers the case details after sign out.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@NextUI
	Scenario: The case list remembers the filters
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100206" in the exception list table
			And I go to the Case Details for this exception "HO100206"
			And I sign out
		Then I am logged in as "supervisor" in the same window
			And I should be on the same case details page with exception "HO100206"
