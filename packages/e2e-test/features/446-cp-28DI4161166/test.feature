Feature: 444

	Background:
	    Given the data for this test is in the PNC
            And "input-message" is received

	@NextUI
	Scenario: Verify CP
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
		# Then there are no exceptions raised for "Olson Michele"
		And I wait 300 seconds
