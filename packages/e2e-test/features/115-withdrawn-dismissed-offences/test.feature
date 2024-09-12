Feature: {115} BR7 R5.1-RCD-327-Handling of Withdrawn-Dismissed Offences

			"""
			{115} BR7 R5.1-RCD-327-Handling of Withdrawn-Dismissed Offences
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Court Results automation (Adjournment with Judgement & Sentence) - where Offences have already been Dismissed and are no longer being reported from Libra - and Trigger generation.
			A number of Court Hearing results are sent through the CJSE and onto Bichard7 for the same case which contains Dismissed/Withdrawn Offences.
			The Result Classes for the Offences move progressively from 'Adjournment with Judgement' to 'Sentence'.
			For each set of results a Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Pre Update Trigger is also successfully created on the Portal.

			MadeTech Definition:
			Handling of Withdrawn-Dismissed Offences
			"""

	Background:
		Given the data for this test is in the PNC

	@Could @NextUI
	Scenario: Handling of Withdrawn-Dismissed Offences
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
		When "input-message-2" is received
		Then there are no exceptions raised for "OFFENCES DISMISSED"
			And I see trigger "PR10 - Conditional bail" in the exception list table
		When "input-message-3" is received
			And I see "1" record for "OFFENCES DISMISSED"
			And the PNC updates the record
