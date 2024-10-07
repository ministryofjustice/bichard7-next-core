Feature: {505} Ignored - no recordable offences

			"""
			The case is ignored because it has no recordable offences.
			An audit log is written.
			"""

	Background:
		Given "input-message" is received
			And the data for this test is in the PNC

	Scenario: Ignored - no recordable offences
		Then the audit log contains "Hearing Outcome ignored as it contains no offences"
		When I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers for this record
			And no PNC updates have been made
