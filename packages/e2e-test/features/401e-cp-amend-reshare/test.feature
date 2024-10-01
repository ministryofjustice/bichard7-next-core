Feature: 401a - CP Amend and re-share (added and removed results)
			"""
			Determining the behaviour when the result text is amended and the record is re-shared
			- Record exists in PNC with one offence with offence code: CJ88001
			- CP sends resulted case message with result codes 1015, 3011, 3117 for offence
			- CP removes results for offence and adds new result with CJS result code: 4027
			- CP resends resulted case message

			Result:
			- Bichard updates the PNC for the first message
			- Bichard raises an exception for the second message because the offences don't match
			"""

	Background:
		Given the data for this test is in the PNC

	@Excluded
	Scenario: Amend and re-share from with changed results
		Given "input-message-1" is received
		And I am logged in as "supervisor"
		And I view the list of exceptions
		Then there are no exceptions or triggers for this record
		When I wait "1" seconds
		And "input-message-2" is received
		Then I see exception "HO200101" for this record in the exception list
		And the PNC updates the record
