Feature: 402 - Splitting bail conditions on a semicolon
			"""
			Ensuring that bail conditions are correct split on a semi-colon
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	Scenario: Splitting bail conditions on a semicolon
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR10" for this record in the exception list
		When I open the record for "SmithY John"
			And I click the "Defendant" tab
			Then I see "Curfew Between : 11:00 And : 22:00 Frequency : 2" in the "Bail Condition" row of the results table
			Then I see "Exclusion - not go to any public house, licensed club or off licence" in the "Bail Condition" row of the results table
			Then I see "Exclusion - not to sit in the front seat of any motor vehicle" in the "Bail Condition" row of the results table
			Then I see "Other - see solicitor / barrister" in the "Bail Condition" row of the results table
			Then I see "Residence - live, and sleep each night, at bail hostel Hostel name : NewHostel" in the "Bail Condition" row of the results table
			And the PNC updates the record
