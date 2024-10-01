Feature: {501} Trigger resolved events

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@NextUI
	Scenario: Generates audit logs for resolving triggers
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		When I open this record
			And I click the "Triggers" tab
		Then I see trigger "TRPR0003" for offence "1"
			And I see trigger "TRPR0004" for offence "1"
			And I see trigger "TRPR0004" for offence "2"
			And the PNC updates the record
		When I resolve all of the triggers
		Then this "record" is "resolved"
			And this "record" is not "unresolved"
			And there are no exceptions for this record
			And the audit log contains "Trigger locked"
			And the audit log contains "Trigger marked as resolved by user"
			And the audit log contains "All triggers marked as resolved"
			And the audit log contains "Trigger unlocked"
