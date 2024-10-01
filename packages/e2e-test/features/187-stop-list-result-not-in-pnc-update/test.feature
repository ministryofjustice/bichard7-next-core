Feature: {187} BR7 R5.3-RCD494 - Date Match with Stop List Result

			"""
			{187} BR7 R5.3-RCD494 - Date Match with Stop List Result
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offence Matching and approximate Date Matching with multiple instances of the same result.
			Specifically:
			Where multiple Offences match on Offence and Result - with the Exception of a Stop List Result on one of the Offences - and the Date Range of the Court Offence data is within the Offence Date Range on the PNC.
			The solution will recognise the Stop List Result received as being in the Result Codes Stop List and strip the Result (1505) from the update that is generated to the PNC.
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.
			Pre Update Trigggers are also created on the Portal.

			MadeTech Definition:
			Stop List Result is removed from the PNC update request
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	Scenario: Stop List Result is removed from the PNC update request
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
		Then there are no exceptions raised for "Hudson Charles"
		When I open the record for "Hudson Charles"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0018" for offence "1"
			And I see trigger "TRPR0018" for offence "2"
			And I see trigger "TRPR0006"
			And the PNC updates the record
