Feature: {280} BR7 R5.8-RCD638 - TRPR0029 - Civil Offence added in Court at Sentence Hearing

			"""
			{280} BR7 R5.8-RCD638 - TRPR0029 - Civil Offence added in Court at Sentence Hearing
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies the handling of Civil Cases by the Bichard7 solution.
			Sentence Hearing Court results are sent through the CJSE and onto Bichard7 and a Civil Offence is Added In Court as part of the same Hearing.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			An Exception is generated as a result of the incompatible (but valid) combination of Civil (Non-Recordable) & Criminal (Recordable) Offences that have been received from Court.
			No update is therefore made to the PNC.
			Since the Civil Offence Results cannot meet the conditions for the Civil Proceedings Trigger the TRPR0029 Trigger is not generated.
			Other Pre Update Triggers are generated as part of the processing for this Case.

			MadeTech Definition:
			Civil Offence added in Court at Sentence Hearing
			"""

	Background:
		Given the data for this test is in the PNC

	@Should @NextUI
	Scenario: Civil Offence added in Court at Sentence Hearing
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
		When "input-message-2" is received
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And I cannot see trigger "PR29" in the exception list table
			And there are no exceptions raised for "CIVILCASE ADDEDATSENTENCE"
		When I open the record for "CIVILCASE ADDEDATSENTENCE"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0003" for offence "2"
			And the PNC updates the record
