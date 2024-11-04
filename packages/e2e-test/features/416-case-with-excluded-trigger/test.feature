Feature: {416} Do not display any cases that has only excluded triggers for the currently signed-in user.

			"""
			As a trigger handler with TRPR0006 excluded for my user profile, I shouldn't see cases that only have TRPR0006.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Display correct cases according to permissions and excluded triggers.
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions raised for "Bethel Barry"
			And there should only be "1" records
			And I see trigger "PR06 - Imprisoned" in the exception list table
		When I am logged in as "TriggerHandlerWithExcludedTRPR0006"
			And I reload the page
			And there should only be "0" records
			And I cannot see trigger "PR06" in the exception list table
