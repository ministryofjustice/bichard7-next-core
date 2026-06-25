Feature: {501a} carry-forward-for-additional-offence

			"""
			Bichard receives a court hearing outcome containing result code 2059 (Carry Forward) for an additional offence and 1015 (Fine) for an existing offence.

			Bichard updates the police system by:
			- applying disposal result 1015 (Fine) to the existing offence; and
			- carrying the additional offence forward to a new court case.
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI @LedsPreProdTest
	Scenario: Police update adds carry forward of result code 2059 for the additional offence
		Given I am logged in as "supervisor"
			And I view the list of exceptions
			And the PNC updates the record
