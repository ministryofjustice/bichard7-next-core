Feature: 401c - CP Amend and re-share (removed result code)
			"""
			Determining the behaviour when a new result code is added and the record is re-shared
			- Record exists in PNC with single offence with offence code: CJ88001
			- CP sends resulted case message with result codes 1116, 3117, 3012, 1015 on offence
			- CP amends case by removing result code 1015 from offence
			- CP resends resulted case message

			Result:
			- Bichard updates the PNC with the results in the first message
			- Bichard ignores the second message because the results are already on the PNC
			"""

	Background:
		Given the data for this test is in the PNC

	@Excluded
	Scenario: Amend and re-share from with removed result code
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then the audit log contains "PNC Update applied successfully"
			And there are no exceptions or triggers for this record
		When "input-message-2" is received
		Then the audit log contains "Results already on PNC"
			And there are no exceptions or triggers for this record
			And the PNC updates the record
