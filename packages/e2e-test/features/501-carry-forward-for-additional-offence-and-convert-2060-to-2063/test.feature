Feature: {501} carry-forward-for-additional-offence-and-convert-2060-to-2063

			"""
			Bichard receives a court hearing outcome containing result code 2059 (Carry Forward) for an additional offence and 2060 (Replaced With Another Offence - Refer to Court Case) for an existing offence.

			Bichard updates the police system by:
			- converting 2060 (Replaced With Another Offence - Refer to Court Case) to 2063 (Withdrawn - Final) and adding it to the disposal; and
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
