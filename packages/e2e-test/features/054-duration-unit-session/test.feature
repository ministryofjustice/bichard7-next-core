Feature: {054} R3.4_BR7_Duration Unit_Session

			"""
			{054} R3.4_BR7_Duration Unit_Session
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation (Judgement with Final Result) and 'Session' handling.
			Court Hearing results are sent through the CJSE and onto Bichard7 containing Sentence information in terms of the number of 'Sessions' the Defendant must attend.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully and automatically added onto the PNC.

			MadeTech Definition:
			Handling messages with session duration
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	@NextUI
	Scenario: Handling messages with session duration
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions or triggers for this record
