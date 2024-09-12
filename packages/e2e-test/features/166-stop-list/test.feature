Feature: {166} BR7 R5.3-RCD505 - Ignored offence - Stop List Result

			"""
			{166} BR7 R5.3-RCD505 - Ignored offence - Stop List Result
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Ignored Offences handling where the Offences are present on the PNC and the Results received from Court are in the Stop List.
			Specifically:
			- Message 1: All Ignored Offences - Results received are in the Stop List
			No PNC Update is generated and No Exception or Trigger is created.
			The solution recognises the Results received as being in the Result Codes Stop List and the Results are purposely ignored.
			Verification is made that this processing has been logged to the database (into the General Event Log).

			MadeTech Definition:
			Results in the stop list are not processed
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	Scenario: Results in the stop list are not processed
		Given I am logged in as "supervisor"
		Then the PNC record has not been updated
			And there are no exceptions or triggers
