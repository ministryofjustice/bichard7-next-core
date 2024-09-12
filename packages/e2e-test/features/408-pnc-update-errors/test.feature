Feature: {408} Handling unexpected PNC enquiry errors

			"""
			Ensuring that if there is a PNC communication error during update,
			it is handled gracefully rather than ending up in a failure queue
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@ExcludeOnPreProd @NextUI
	Scenario: Handling unexpected errors for PNC update
		Given I am logged in as "supervisor"
			And I view the list of exceptions
			Then I see exception "HO100404" in the exception list table
