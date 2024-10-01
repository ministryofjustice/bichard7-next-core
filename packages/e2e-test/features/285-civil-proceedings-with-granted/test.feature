Feature: {285} BR7 R5.8-RCD638 - TRPR0029 - Offence Code plus Granted Text

			"""
			{285} BR7 R5.8-RCD638 - TRPR0029 - Offence Code plus Granted Text
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies the handling of Civil Cases by the Bichard7 solution.
			Civil Case Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			All Offences are recognised as those that should generate the Civil Proceedings Trigger based on Offence Code and "Granted" Result Text combination.
			No Exception is raised and no PNC Update is generated.

			MadeTech Definition:
			Generate civil proceedings trigger with "granted" text
			"""

	Background:
		Given "input-message" is received

	@Should @NextUI
	Scenario: Generate civil proceedings trigger with "granted" text
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
		Then I see trigger "PR29 - Civil Proceedings" in the exception list table
			And there are no exceptions raised for "CIVILCASE GRANTEDTEXT"
			And no PNC requests have been made
