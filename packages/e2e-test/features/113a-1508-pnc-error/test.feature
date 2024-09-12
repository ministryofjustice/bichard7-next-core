Feature: {113a} BR7 R5.1-RCD422-Breach of Suspended Sentence-Order to Continue

			"""
			{113} BR7 R5.1-RCD422-Breach of Suspended Sentence-Order to Continue
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Breach Offence handling where a Further Offence is charged, Exception and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The Further Offence is Sentenced with a Fine and the Sentence for the original Offence (received from Court as Offence Code 'CJ03507') is left to continue but with a varied and increased duration using Result Code '1508'.
			'1508' is a Result Code that is not accepted by the PNC and so the PNC Update message sent by Bichard7 to the PNC generates an Exception instead of a successful PNC Update.
			Pre Update Triggers are also created.

			MadeTech Definition:
			PNC Error for result code 1508
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: PNC Error for result code 1508
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
			And the PNC updates the record
