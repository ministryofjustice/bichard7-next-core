Feature: {417} Do not display excluded triggers on cases for the currently signed-in user.

			"""
			As a trigger handler with TRPR0008 excluded for my user profile, I should not see TRPR0008 on any cases when I log in.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@NextUI @ExcludeOnLegacyUI
	Scenario: Display correct cases according to permissions and excluded triggers.
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions raised for "DENIES Breachy"
			And there should only be "1" records
			And I see trigger "PR08 - Breach of bail" in the exception list table
			And I see trigger "PR10 - Conditional bail" in the exception list table
		When I am logged in as "TriggerHandlerWithExcludedTRPR0008"
			And I reload the page
			And there should only be "1" records
			And I cannot see trigger "PR08" in the exception list table
			And I see trigger "PR10 - Conditional bail" in the exception list table
