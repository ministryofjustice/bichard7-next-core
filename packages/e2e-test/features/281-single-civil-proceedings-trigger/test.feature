Feature: {281} BR7 R5.8-RCD638 - TRPR0029 - Identical Civil Offences

			"""
			{281} BR7 R5.8-RCD638 - TRPR0029 - Identical Civil Offences
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies the handling of Civil Cases by the Bichard7 solution.
			Civil Case Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The Offences are recognised as 2x identical Civil Offences that should  generate the Civil Proceedings Trigger based on Offence Code and "Granted" Result Text combination.
			A single Civil Proceedings Trigger is generated since the Trigger is a Case-level Trigger.
			No Exception is raised and no PNC Update is generated.

			MadeTech Definition:
			Generating a single civil proceedings trigger
			"""

	Background:
		Given "input-message" is received

	@Should @NextUI
	Scenario: Generating a single civil proceedings trigger
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR20 - Breach" in the exception list table
			And I see trigger "PR29 - Civil Proceedings" in the exception list table
			And there are no exceptions raised for "CIVILOFFENCES IDENTICAL"
		When I open the record for "CIVILOFFENCES IDENTICAL"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0020" for offence "1"
			And I see trigger "TRPR0020" for offence "2"
			And I see trigger "TRPR0029"
			And no PNC requests have been made
