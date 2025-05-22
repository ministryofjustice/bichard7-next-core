Feature: {412} Returning to relevant case list from error page

			"""
			When a user lands on the error page, they can click the "Return to case list" button, which navigates them back to the error list.
			"""

	Background:
		Given "input-message" is received

	@NextUI
	@ExcludeOnLegacyUI
	Scenario: Clicking "Return to case list" button on error page will take user to the case list (new ui)
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
			And I open the record for "DASWON CAO"
			And I am redirected to a Page Not Found page
		When I click the "Return to case list" button
			Then the exception list should contain a record for "DASWON CAO"
			Then I see button "Switch to old Bichard" with class "govuk-width-container"

	@Should
	Scenario: Clicking "Return to case list" button on error page will take user to the case list (old ui)
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
			And I open the record for "DASWON CAO"
			And I am redirected to a Page Not Found page
		When I click the "Return to case list" button
			Then the exception list should contain a record for "DASWON CAO"
			Then I see button "Switch to new Bichard" with class "wpsToolBarBichardSwitch"

	@NextUI
	@ExcludeOnLegacyUI
	Scenario: Return to case list navigates to legacy Bichard when error occurs after switching from new Bichard
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then the exception list should contain a record for "DASWON CAO"
			And I switch to the alternate version of bichard
			And the alternate exception list should contain a record for "DASWON CAO"
			And I am redirected to a Page Not Found page
		When I click the "Return to case list" button
			Then I see button "Switch to new Bichard" with class "wpsToolBarBichardSwitch"

	@Should
	@NextUI
	Scenario: Return to case list navigates to new Bichard when error occurs after switching from legacy Bichard
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then the exception list should contain a record for "DASWON CAO"
			And I switch to the alternate version of bichard
			And the alternate exception list should contain a record for "DASWON CAO"
			And I am redirected to a Page Not Found page
		When I click the "Return to case list" button
		    Then I see button "Switch to old Bichard" with class "govuk-width-container"
