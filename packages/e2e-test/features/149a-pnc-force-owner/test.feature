Feature: {149a} Change of Force Owner on Police System

			"""
			{149a} Change of Force Owner on Police System
			===============
			Force owner is derived from the PNC response
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI @ExcludedOnPnc
	Scenario: Force owner is derived from the PNC response
		Given I am logged in as "met.police"
			And I view the list of exceptions
		Then I see trigger "PS10 - Offence added to PNC" in the exception list table
			And the PNC updates the record
		When I am logged in as "br7.btp"
			And I view the list of exceptions
		Then there are no exceptions or triggers
