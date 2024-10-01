Feature: {312} BR7-R5.10-RCD606-Permit Court Offence Sequence Number of 0

			"""
			{312} BR7-R5.10-RCD606-Permit Court Offence Sequence Number of 0
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying the receipt of an Offence Sequence Number of '0' from Magistrates court.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			based on ResultedCaseMessage contents.
			No HO100239 Exception is generated for the offence sequence number of '0'.
			PNC is successfully updated with partialresult 3070.
			Urgent Flag and Pre and Post update Triggers are produced as part of the processing of this case.

			MadeTech Definition:
			Allowing court offence sequence number of zero
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Allowing court offence sequence number of zero
		Given I am logged in as "supervisor"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And I see trigger "PS02 - Check address" in the exception list table
		When I open the record for "ZERO OFFENCESEQUENCE"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0001" for offence "1"
			And I see trigger "TRPR0001" for offence "3"
			And I see trigger "TRPR0006"
			And I see trigger "TRPS0002"
