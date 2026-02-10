Feature: {500} refer-to-court-case

			"""
			Bichard receives a court hearing outcome that includes:
			- result code 2060 for an existing offence
			- a recordable result code (1015) for an additional offence where the conviction date is the same as the hearing date
			Bichard updates the police system with the new disposal results and refer to the court case.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Police update adds refer to court case when case requires RCC and has reportable offences
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
			And the PNC updates the record
