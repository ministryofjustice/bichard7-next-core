Feature: {188} BR7 R5.3-RCD494 - 2x Offence Date Match

			"""
			{188} BR7 R5.3-RCD494 - 2x Offence Date Match
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Matching and approximate Date Matching with multiple instances of the same result.
			Specifically:
			Where multiple Offences match on Offence and Result (2 x sets of 3 x Offences that match) and the Date Range of the Court Offence data is within the Offence Date Range on the PNC.
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			Pre Update Trigggers are also created on the Portal.

			MadeTech Definition:
			Matching multiple offences with approximate date matching
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	Scenario: Matching multiple offences with approximate date matching
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And there are no exceptions raised for "Bishop Charles"
		When I open the record for "Bishop Charles"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0006"
			And I see trigger "TRPR0018" for offence "1"
			And I see trigger "TRPR0018" for offence "2"
			And I see trigger "TRPR0018" for offence "3"
			And I see trigger "TRPR0018" for offence "4"
			And I see trigger "TRPR0018" for offence "5"
			And I see trigger "TRPR0018" for offence "6"
			And the PNC updates the record
