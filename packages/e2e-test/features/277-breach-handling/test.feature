Feature: {277} BR7-R5.8-RCD628 - Standalone Breach Admits Plea No Verdict

			"""
			{277} BR7-R5.8-RCD628 - Standalone Breach Admits Plea No Verdict
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies various Result Classes with a Plea of Admits and no Conviction Date for a Breach Case.
			Court Hearing Results for an existing Standalone Breach Offence are sent through the CJSE and onto Bichard7.
			The Remand Results from Court include a Plea of Admits and no Adjudication details.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The PNC is successfully updated with the Breach (Remand) details.
			Pre Update Triggers are also generated.
			A 2nd set of Court Hearing Results are sent through the CJSE and onto Bichard7.
			The Remand Results from Court include a Plea of Admits and no Adjudication details.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The PNC is successfully updated with the Breach (Remand) details.
			Pre Update Triggers are also generated.
			A final set of Court Hearing Results are sent through the CJSE and onto Bichard7.
			The Sentence Results from Court include a Plea of Admits and no Adjudication details.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The PNC is successfully updated with the Breach (Sentence) details.
			Pre Update Triggers are also generated.

			MadeTech Definition:
			Handling breach result classes
			"""

	Background:
		Given the data for this test is in the PNC

	@Should
	Scenario: Handling breach result classes
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR10 - Conditional bail" in the exception list table
			And there are no exceptions raised for "BREACHPLEANOVERDICT Standalone"
		When I open the record for "BREACHPLEANOVERDICT Standalone"
			And I click the "Offences" tab
			And I view offence "1"
		Then I see "Adjournment pre Judgement" in the "Result Class" row of the results table
		When "input-message-2" is received
			And I unlock the record and return to the list
		Then I see trigger "PR10 - Conditional bail" in the exception list table
			And there are no exceptions raised for "BREACHPLEANOVERDICT Standalone"
		When I open the record for "BREACHPLEANOVERDICT Standalone"
			And I click the "Offences" tab
			And I view offence "1"
		Then I see "Adjournment pre Judgement" in the "Result Class" row of the results table
		When "input-message-3" is received
			And I unlock the record and return to the list
		Then I see trigger "PR20 - Breach" in the exception list table
			And there are no exceptions raised for "BREACHPLEANOVERDICT Standalone"
		When I open the record for "BREACHPLEANOVERDICT Standalone"
			And I click the "Offences" tab
			And I view offence "1"
		Then I see "Judgement with final result" in the "Result Class" row of the results table
			And the PNC updates the record
