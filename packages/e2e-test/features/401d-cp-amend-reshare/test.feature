Feature: 401c - CP Amend and re-share (added second offence)
			"""
			Determining the behaviour when a new result code is added and the record is re-shared
			- Record exists in PNC with two offences with offence codes: CJ88001 and CJ88116
			- CP sends resulted case message with result codes 1015, 3011, 3117 for first offence (second does not appear in payload)
			- CP results second offence with result codes: 1015, 3012
			- CP resends resulted case message with both offences included

			Result:
			- Bichard raises an exception for the first message the offences don't match the PNC
			- Bichard successfully updates the second message
			"""

	Background:
		Given the data for this test is in the PNC

	@Excluded
	Scenario: Amend and re-share from with second offence
		Given "input-message-1" is received
		And I am logged in as "supervisor"
		And I view the list of exceptions
		Then I see trigger "HO100304" for this record in the exception list
		When I wait "1" seconds
		And "input-message-2" is received
		Then the PNC updates the record
