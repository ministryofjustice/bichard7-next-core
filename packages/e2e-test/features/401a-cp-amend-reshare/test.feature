Feature: 401a - CP Amend and re-share (changed result text)
			"""
			Determining the behaviour when the result text is amended and the record is re-shared
			- Record exists in PNC with single offence. Offence code: CJ88001
			- CP sends resulted case message with CJS result code: 4576
			- CP amends case by changing result text / reason for warrant
			- CP resends resulted case message

			Result:
			- Bichard creates a trigger and updates the PNC for the first message
			- Bichard creates a trigger and updates the PNC for the second message
			"""

	Background:
		Given the data for this test is in the PNC

	@Excluded
	Scenario: Amend and re-share from with changed result text
		Given "input-message-1" is received
		And I am logged in as "supervisor"
		And I view the list of exceptions
		Then I see trigger "PR02 - Warrant issued" for this record in the exception list
		And I wait "1" seconds
		And "input-message-2" is received
		# Two records appear in Bichard
		# Case is updated twice
		Then the PNC updates the record
