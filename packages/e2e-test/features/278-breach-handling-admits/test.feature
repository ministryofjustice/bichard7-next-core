Feature: {278} BR7-R5.8-RCD628 - Breach Plus Other Offences Admits Plea No Verdict

			"""
			{278} BR7-R5.8-RCD628 - Breach Plus Other Offences Admits Plea No Verdict
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies various Result Classes with a Plea of Admits and no Conviction Date for a Breach Case.
			Court Hearing Results for existing Offences - one of which is a Breach Offence - are sent through the CJSE and onto Bichard7.
			The Breach Remand Results from Court include a Plea of Admits and no Adjudication details.
			The other Offences are found Guilty and are also Adjourned to the same Hearing.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The PNC is successfully updated with the Remand details.
			Pre Update Triggers are also generated.
			A 2nd set of Court Hearing Results are sent through the CJSE and onto Bichard7.
			The Breach Remand Results from Court include a Plea of Admits and no Adjudication details.
			The other Offences are also Adjourned to the same Hearing.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The PNC is successfully updated with the Remand details.
			Pre Update Triggers are also generated.
			A final set of Court Hearing Results are sent through the CJSE and onto Bichard7.
			The Breach Sentence Results from Court include a Plea of Admits and no Adjudication details.
			The other Offences are also Sentenced at the same Hearing.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The PNC is successfully updated with the Sentencing details.
			Pre Update Triggers are also generated.

			MadeTech Definition:
			Handling breach results with a plea of 'Admits'
			"""

	Background:
		Given the data for this test is in the PNC

	@Should
	Scenario: Handling breach results with a plea of 'Admits'
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR10 - Conditional bail" in the exception list table
			And there are no exceptions raised for "BREACHPLEANOVERDICT OtherOffences"
		When I open the record for "BREACHPLEANOVERDICT OtherOffences"
			And I click the "Offences" tab
			And I view offence "1"
		Then I see "Adjournment pre Judgement" in the "Result Class" row of the results table
		When "input-message-2" is received
			And I unlock the record and return to the list
		Then I see trigger "PR10 - Conditional bail" in the exception list table
			And there are no exceptions raised for "BREACHPLEANOVERDICT OtherOffences"
		When I open the record for "BREACHPLEANOVERDICT OtherOffences"
			And I click the "Offences" tab
			And I view offence "1"
		Then I see "Adjournment pre Judgement" in the "Result Class" row of the results table
		When "input-message-3" is received
			And I unlock the record and return to the list
		Then I see trigger "PR20 - Breach" in the exception list table
			And there are no exceptions raised for "BREACHPLEANOVERDICT OtherOffences"
		When I open the record for "BREACHPLEANOVERDICT OtherOffences"
			And I click the "Offences" tab
			And I view offence "1"
		Then I see "Judgement with final result" in the "Result Class" row of the results table
			And the PNC updates the record
