Feature: {286} BR7 R5.8-RCD638 - TRPR0029 - Offence Code Trigger only

			"""
			{286} BR7 R5.8-RCD638 - TRPR0029 - Offence Code Trigger only
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies the handling of Civil Cases by the Bichard7 solution.
			Civil Case Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			All Offences are recognised as those that should generate the Civil Proceedings Trigger based on Offence Code only.
			No Exception is raised and no PNC Update is generated.

			MadeTech Definition:
			Creating civil proceedings triggers based on offence code
			"""

	Background:
		Given "input-message" is received

	@Should @NextUI
	Scenario: Creating civil proceedings triggers based on offence code
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
		Then I see trigger "PR29 - Civil Proceedings" in the exception list table
			And I see trigger "PR03 - Order issues" in the exception list table
			And there are no exceptions raised for "CIVILCASE OFFENCECODEONLY"
			And no PNC requests have been made
