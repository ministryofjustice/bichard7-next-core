Feature: {412} Switching between bichard versions for case list

			"""
			The bichard switching button allows users to switch to
			the alternate version of bichard and maintain the context
			that they're currently in.

			This test should ensure that users can see the button
			and that it takes them from one case list to the
			alternate case list.
			"""

	Background:
		Given "input-message" is received

	@Should @NextUI
	Scenario: Switching to the alternate version of bichard from the case list should take you to the alternate version's case list
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then the exception list should contain a record for "DASWON CAO"

		When I switch to the alternate version of bichard
	  Then the alternate exception list should contain a record for "DASWON CAO"
