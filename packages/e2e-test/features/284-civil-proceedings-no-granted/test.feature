Feature: {284} BR7 R5.8-RCD638 - TRPR0029 - Offence Code Granted Text Missing

			"""
			{284} BR7 R5.8-RCD638 - TRPR0029 - Offence Code Granted Text Missing
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies the handling of Civil Cases by the Bichard7 solution.
			Civil Case Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			All Offences are recognised as those that should generate the Civil Proceedings Trigger based on Offence Code and "Granted" Result Text combination - however, the "Granted" Text has been omitted and therefore no Civil Proceedings Trigger is generated.
			No Exception is raised and no PNC Update is generated.

			MadeTech Definition:
			No civil proceedings trigger without "granted" text
			"""

	Background:
			And "input-message" is received

	@Should @NextUI
	Scenario: No civil proceedings trigger without "granted" text
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then there are no exceptions raised for "CIVILCASE GRANTEDTEXTMISSING"
			And there are no triggers raised for "CIVILCASE GRANTEDTEXTMISSING"
			And no PNC requests have been made
