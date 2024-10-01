Feature: {127} BR7 R5.1-RCD411-Date Codes 2 and 3 and 6 Offence Matching

			"""
			{127} BR7 R5.1-RCD411-Date Codes 2 and 3 and 6 Offence Matching
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Code Matching where a PNC Offence has an End Date but a matching Court Offence does not and the Court Offence has an Offence Date Code value of 2, 3 or 6'.
			Specifically:
			- Offence 1 is associated to an OffenceDateCode value of '2' and has no Court Offence End Date.
			The PNC matching Offence DOES have an associated PNC Offence End Date and this is NOT considered a match and the HO Error is generated as a result
			- Offence 2 is associated to an OffenceDateCode value of '3' and has no Court Offence End Date.
			The PNC matching Offence DOES have an associated PNC Offence End Date and this is NOT considered a match and the HO Error is generated as a result
			- Offence 3 is associated to an OffenceDateCode value of '6' and has no Court Offence End Date.
			The PNC matching Offence DOES have an associated PNC Offence End Date and this is NOT considered a match and the HO Error is generated as a result

			MadeTech Definition:
			Checking matches for court dates
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Checking matches for court dates
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see exception "HO100304" in the exception list table
			And there are no triggers raised for "TWOTHREESIX DATECODES"
			And the PNC record has not been updated
