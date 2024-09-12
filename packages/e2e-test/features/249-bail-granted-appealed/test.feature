Feature: {249} BR7 R5.6-RCD581-Granted Bail-Prosecution Appealed Bail

			"""
			{249} BR7 R5.6-RCD581-Granted Bail-Prosecution Appealed Bail
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation of Bail Granted but then Appealed by the Prosecution at the same Court Hearing.
			Court Hearing results are sent through the CJSE and onto Bichard7 containing a Remand (i.e.
			Bail Conditions in the Result) but an Appeal by the Prosecution which is granted and the Defendant is subsequently Remanded into Custody.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The Court Hearing Results are successfully added automatically onto the PNC.

			MadeTech Definition:
			Bail granted but appealed by prosecution at the same court hearing
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Bail granted but appealed by prosecution at the same court hearing
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR05 - Remand in custody" in the exception list table
			And I see trigger "PR24 - Vulnerable victim" in the exception list table
			And there are no exceptions raised for "APPEALEDBAIL Prosecution"
			And the PNC updates the record
