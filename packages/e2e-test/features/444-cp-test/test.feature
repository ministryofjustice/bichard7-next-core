Feature: 444

	Background:
		Given "input-message" is received

	@NextUI
	Scenario: Verify CP
		Given I am logged in as "generalhandler"
		And I view the list of exceptions
		And I wait 300 seconds
