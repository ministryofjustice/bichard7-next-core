Feature: 404 - Fixing exceptions and triggers and resubmitting

			"""
			There is an exception on the incoming message which, when fixed, is resubmitted successfully to the PNC
			Additionally, there are triggers raised which are resolved
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@NextUI
	Scenario: Updates and triggers are correctly generated for sexual offences
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see exception "HO100206" in the exception list table
		When I open the record for "SEXOFFENCE TRPRFOUR"
			And I click the "Defendant" tab
			And I correct "ASN" to "1101ZD0100000448754K"
			And I submit the record
		When I reload until I don't see "(Submitted)"
			And I click the "Refresh" button
			And I return to the list
		Then the "exception" for "SEXOFFENCE TRPRFOUR" is "resolved"
			And the PNC updates the record
		When I view the list of exceptions
		When I open this record
			And I click the "Triggers" tab
		Then I see trigger "TRPR0003" for offence "1"
			And I see trigger "TRPR0004" for offence "1"
			And I see trigger "TRPR0004" for offence "2"
			And the PNC updates the record
		When I resolve all of the triggers
		Then the "record" for "SEXOFFENCE TRPRFOUR" is "resolved"
			And there are no exceptions for this record
