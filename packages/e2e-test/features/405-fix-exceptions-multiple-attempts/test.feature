Feature: 405 - Fixing exceptions and resubmitting with multiple attempts

			"""
			There is an exception on the incoming message which, when fixed, is resubmitted successfully to the PNC
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	Scenario: Handling messages with session duration
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100206" in the exception list table
		When I open the record for "Ladyfish Larry"
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000410804B"
			And I submit the record
		When I reload until I don't see "(Submitted)"
			And I click the "Refresh" button
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000410804K"
			And I submit the record
			And I return to the list
		Then the PNC updates the record
			And the "record" for "Ladyfish Larry" is "resolved"
			And there are no exceptions or triggers for this record

	@NextUI
	@ExcludeOnLegacyUI
	Scenario: Exception can only be submitted when the input is valid
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100206" in the exception list table
		When I open the record for "Ladyfish Larry"
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000410804B"
		Then the invalid "ASN" can be submitted
			And I correct "ASN" to "1101ZD0100000410804K"
			And I submit the record
			And I return to the list
		Then the PNC updates the record
			And the "record" for "Ladyfish Larry" is "resolved"
			And there are no exceptions or triggers for this record
