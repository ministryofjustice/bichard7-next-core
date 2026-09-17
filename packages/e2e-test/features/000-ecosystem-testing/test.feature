Feature: {001} LEDS_ECOSYSTEM_SMOKE_TESTING

			"""
			Temporary test for LEDS Ecosystem Smoke Testing
			"""

	Background:
		Given the data for this test is in the PNC

	@Should
	@NextUI
	@LedsPreProdTest
	Scenario: Testing all LEDS operations
		Given "input-message-1" is received
			And I wait "10" seconds
		Then "input-message-2" is received
			And I wait "10" seconds
			And the PNC updates the record
