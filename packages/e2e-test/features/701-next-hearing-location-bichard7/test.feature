Feature: Next Hearing location Bichard UI

			"""
			Next Hearing location - HO100300 in Bichard UI
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	Scenario: No next hearing location
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100300" in the exception list table
		When I open the record for "TRTWODATE TRIGGER"
			And I click the "Offences" tab
			And I view offence "1"
			And I correct "Next Hearing location" to "B01EF01"
		Then I submit the record
			And the PNC updates the record
