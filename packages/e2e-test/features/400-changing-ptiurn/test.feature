Feature: 400 - Changing the PTIURN

			"""
			400 - Changing the PTIURN
			===============
			Testing that the record is still updated as usual when the PTIURN is
			different in the incoming message compared to the PNC (test based on 034a)
			"""

	Background:
		Given the data for this test is in the PNC
		And "input-message" is received

	@NextUI
	Scenario: Validating correct ASN format
		Given I am logged in as "supervisor"
		And I view the list of exceptions
		Then the PNC updates the record
		And there are no exceptions or triggers for this record
