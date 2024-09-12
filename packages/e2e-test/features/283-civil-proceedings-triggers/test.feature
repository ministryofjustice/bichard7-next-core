Feature: {283} BR7 R5.8-RCD638 - TRPR0029 - Multiple Trigger-generating conditions

			"""
			{283} BR7 R5.8-RCD638 - TRPR0029 - Multiple Trigger-generating conditions
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies the handling of Civil Cases by the Bichard7 solution.
			Civil Case Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The Offences are recognised as comprising:
			1) A Civil Offence that should be Ignored
			2) A Civil Offence that should  generate the Civil Proceedings Trigger based on Offence Code only
			3) A Civil Offence that should  generate the Civil Proceedings Trigger based on Offence Code and "Granted" Result Text combination
			A single Civil Proceedings Trigger is generated since the Trigger is a Case-level Trigger.
			No Exception is raised and no PNC Update is generated.

			MadeTech Definition:
			Generating civil proceedings triggers
			"""

	Background:
		Given "input-message" is received

	@Should @NextUI
	Scenario: Generating civil proceedings triggers
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR03 - Order issues" in the exception list table
			And I see trigger "PR29 - Civil Proceedings" in the exception list table
			And there are no exceptions raised for "CIVILCASE ALLOFFENCETYPES"
			And no PNC requests have been made
