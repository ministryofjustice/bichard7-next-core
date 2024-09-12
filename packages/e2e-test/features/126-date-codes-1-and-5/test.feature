Feature: {126} BR7 R5.1-RCD411-Date Codes 1 and 5 Offence Matching

			"""
			{126} BR7 R5.1-RCD411-Date Codes 1 and 5 Offence Matching
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Code Matching where a PNC Offence has an End Date but a matching Court Offence does not and the Court Offence has Offence Date Code values of 1 or 5.
			Specifically:
			- Offence 1 is associated to an OffenceDateCode value of '1' and has no Court Offence End Date.
			However, the PNC matching Offence DOES have an associated PNC Offence End Date therefore this is considered a match and the Trigger is raised to alert the user to the fact that details may need to be manually updated
			- Offence 2 is associated to an OffenceDateCode value of '5' and has no Court Offence End Date.
			However, the PNC matching Offence DOES have an associated PNC Offence End Date therefore this is considered a match and the Trigger is raised to alert the user to the fact that details may need to be manually updated
			Successful update of the PNC is made and PRE and POST Update Triggers are also created.

			MadeTech Definition:
			Offence code matching for date codes 1 and 5
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Offence code matching for date codes 1 and 5
		Given I am logged in as "supervisor"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PS10 - Offence added to PNC" in the exception list table
			And there are no exceptions raised for "ONEANDFIVE DATECODES"
		When I open the record for "ONEANDFIVE DATECODES"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0018" for offence "1"
			And I see trigger "TRPR0018" for offence "2"
			And I see trigger "TRPS0010" for offence "4"
