Feature: {500} carry-forward-for-existing-and-additional-offences

			"""
			Bichard receives a court hearing outcome that includes result code 2059 for an existing and additional offences.
			Bichard updates the police system with the new disposal result 2059 and carries it forward to the court case.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Police update adds carry forward of result code 2059 for the existing and additional offences
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
			And the PNC updates the record
