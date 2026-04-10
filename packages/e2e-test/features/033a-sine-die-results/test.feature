Feature: {033a} Sine Die - Add Result Code 3027

			"""
			{033a} Sine Die - Add Result Code 3027

			MadeTech Definition:
			Correctly handling Sine Die results.
			This test is similar to test 033, but it only verifies adding subsequent disposal results.
			"""

	Background:
		Given the data for this test is in the PNC

	@Could @NextUI @LedsPreProdTest
	Scenario: Correctly handling Sine Die results
		Given I am logged in as "supervisor"
		When "input-message" is received
		Then the PNC updates the record
