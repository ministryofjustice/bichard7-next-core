Feature: {407} Handling unexpected PNC enquiry errors

			"""
			Ensuring that if there is a PNC communication error,
			it is handled gracefully rather than ending up in a failure queue
			"""

	Background:
		And "input-message" is received

	@ExcludeOnPreProd @ExcludedOnConductor @NextUI
	Scenario: Handling unexpected errors for PNC enquiry
		Given I am logged in as "supervisor"
			And I view the list of exceptions
			Then I see exception "HO100314" in the exception list table
