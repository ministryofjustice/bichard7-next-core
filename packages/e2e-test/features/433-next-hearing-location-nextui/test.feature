Feature: 433 - Next Hearing location Next UI

			"""
			Next Hearing location - HO100300 in Next UI
			Also testing the Typeahead component
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@ExcludeOnLegacyUI
	@NextUI
	@ExcludedOnRealLeds
	Scenario: No next hearing location
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100300" in the exception list table
		When I go to the Case Details for this exception "HO100300"
			And I click the "Offences" tab
			And I view offence with text "Aggravated vehicle taking - ( driver did not take ) and vehicle damage of £5000 or over"
			And I correct "Next Hearing location" and type "B01EF01"
		Then I submit the record on the case details page
			And I click the "Offences" tab
			And I view offence with text "Aggravated vehicle taking - ( driver did not take ) and vehicle damage of £5000 or over"
		Then I see the "Correction" badge
