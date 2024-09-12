Feature: {213} BR7 R5.4-RCD533-Offences taken into consideration-SENDEF

			"""
			{213} BR7 R5.4-RCD533-Offences taken into consideration-SENDEF
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offences Taken Into Consideration handling where they are added as part of a Sentence Hearing.
			Court Hearing results are sent through the CJSE and onto Bichard7 containing details of Offences Taken Into Consideration (Result Code "3118").
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Since the Offences Taken Into Consideration cannot be added to the PNC (since the update to the PNC at this point is via a SENDEF PNC Message Type) a POST Update Trigger identifying the need for this to be manually added is also successfully created on the Portal.

			MadeTech Definition:
			Offences taken into consideration
			"""

	Background:
		Given the data for this test is in the PNC

	@Should
	@NextUI
	Scenario: Offences taken into consideration
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
		When "input-message-2" is received
		Then I see trigger "PS13 - Offence(s) TIC" in the exception list table
			And there are no exceptions raised for "SENDEF TICS"
			And the PNC updates the record
