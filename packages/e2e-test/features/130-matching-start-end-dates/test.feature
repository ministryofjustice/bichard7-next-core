Feature: {130} BR7 R5.1-RCD411-Offence Matching-Start-End-Dates Match

			"""
			{130} BR7 R5.1-RCD411-Offence Matching-Start-End-Dates Match
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Code Matching where all Court Offence Start/End Dates and PNC Offence Start/End Dates match.
			The Bichard7 solution cannot immediately automate the Results from Court since multiple Court Offences with different results match a PNC Offence and therefore an Exception is created.
			Offence Sequence Number values are manually assigned (leaving the Offence Sequence Number for an Offence Added In Court BLANK), the record resubmitted from the Portal and a successful update to the PNC is made.
			Post Update Triggers are also created.

			MadeTech Definition:
			Handling exceptions when start and end dates match
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Handling exceptions when start and end dates match
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
		Then I see exception "HO100310 (2)" in the exception list table
		When I open the record for "STARTENDDATES OFFENCEMATCH"
			And I click the "Offences" tab
			And I view offence "1"
			And I match the offence to PNC offence "1"
			And I return to the offence list
			And I view offence "4"
			And I match the offence as Added In Court
			And I submit the record
		Then the PNC updates the record
		When I reload until I see "PS10 - Offence added to PNC"
		Then I cannot see trigger "TRPR0018" in the exception list table
