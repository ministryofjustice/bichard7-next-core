Feature: {412} Switching between bichard versions for old-bichard-only users

			"""
The bichard switching button allows users to switch to
			the alternate version of bichard and maintain the context
			that they're currently in.

			This test should ensure that users who don't belong to the
			NewUI user group aren't able to see the switcher in old
			Bichard.
			"""

	Background:
		Given "input-message" is received

	# !@NextUI - should never run on new UI
	@Should
	Scenario: Switching to the alternate version of bichard from the case list should take you to the alternate version's case list
		Given I am logged in as "old.bichard.user"

		When I view the list of exceptions
		Then I should not see a button to switch to the alternate version of bichard

		When I open the record for "DASWON CAO"
		Then I should not see a button to switch to the alternate version of bichard
