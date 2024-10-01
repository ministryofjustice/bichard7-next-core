Feature: {330} Result code 3324 (Serious Violence Reduction Order) should raise trigger TRPR0003

			"""
			Determining the behaviour when the result code 3324 appears in an offence
			- Record exists in PNC with one offence with offence code: CD71041
			- CP sends resulted case message with result code 3324 for offence

			Result:
			- Bichard updates the PNC
			- Bichard raises trigger TRPR0003
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	Scenario: trigger is correctly generated for Serious Violence Reduction Order
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR03 - Order issues" for this record in the exception list
		When I open this record
			And I click the "Triggers" tab
		Then I see trigger "TRPR0003" for offence "1"
		When I click the "Offences" tab
			And I view offence "1"
		Then I see "3324" in the "CJS Code" row of the results table
			And I see "Serious Violence Reduction Order" in the "Text" row of the results table
			And the PNC updates the record
