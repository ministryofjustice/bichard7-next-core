Feature: {500} Lock and unlock events
	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@NextUI
	Scenario: Generates audit logs for locking and unlocking the case
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		When I open this record
		Then the audit log contains "Trigger locked"
			And the audit log contains "Exception locked"
		When I unlock the record and return to the list
		Then the audit log contains "Trigger unlocked"
			And the audit log contains "Exception unlocked"
