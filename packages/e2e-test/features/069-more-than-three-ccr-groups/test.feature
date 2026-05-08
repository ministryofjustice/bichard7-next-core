Feature: {069} Bichard can handle more than 3 disposal groups
			"""
			{069} Bichard can handle more than 3 disposal groups
			===============
			MadeTech Definition:
			Verifies that Bichard can handle more than three disposal groups.
			PNC enquiries are limited to three disposal groups, whereas LEDS has no such limit and may return any number of disposal groups (court cases). This ensures Bichard works correctly with LEDS enquiries.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@PreProdTest
	@ExcludedOnPnc
	Scenario: Handles 5 CCR groups
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
			And I see trigger "PR06 - Imprisoned" in the exception list table
			And the PNC updates the record
		When I open the record for "LOMAX DAVID"
			And there are no exceptions for this record
