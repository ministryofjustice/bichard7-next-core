Feature: {412} Switching between bichard versions for case details

			"""
			The bichard switching button allows users to switch to
			the alternate version of bichard and maintain the context
			that they're currently in.

			This test should ensure that users can see the button
			and that it takes them from one case's details to the
			alternate case details page.
			"""

	Background:
		Given "input-message" is received

	@Should @NextUI
	Scenario: Switching to the alternate version of bichard from the case list should take you to the alternate version's case list
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
			And I open the record for "DASWON CAO"

		# should now skip through feedback page on the way to case
		# details in the other UI
		When I switch to the alternate version of bichard
			And I click the alternate "Defendant" tab
		Then I see "CAO" in the "Given Name" row of the alternate results table
			And I see "DASWON" in the "Family Name" row of the alternate results table
