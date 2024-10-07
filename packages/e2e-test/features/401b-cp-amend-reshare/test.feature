Feature: 401b - CP Amend and re-share (added result code)
			"""
			Determining the behaviour when a new result code is added and the record is re-shared
			- Record exists in PNC with single offence with offence code: SX03007
			- CP sends resulted case message with result codes on offence of CJS result codes: 1179, 3117
			- CP amends case by adding result code 3052 to offence
			- CP resends resulted case message

			Results:
			- Bichard raises a trigger and updates the PNC for the first message
			- Bichard raises an exception for the second message because the result is already on the PNC
			"""

	Background:
		Given the data for this test is in the PNC

	@Excluded
	Scenario: Amend and re-share from with added result code
		Given "input-message-1" is received
		And I am logged in as "supervisor"
		And I view the list of exceptions
		Then I see trigger "PR04 - Sex offender" for this record in the exception list
		And I wait "1" seconds
		And "input-message-2" is received
		# Two records appear in Bichard
		# Second record has an exception
		Then I see trigger "HO200104" for this record in the exception list
		Then the PNC updates the record
