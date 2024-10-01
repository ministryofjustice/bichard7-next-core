Feature: {101} R4.1.3_BR7_New Trigger TRPR0016

			"""
			{101} R4.1.3_BR7_New Trigger TRPR0016
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Results automation (Judgement with Final Result) and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			A Generic Pre Update Trigger configured for both Recordable Offences only (i.e.
			with a setting of "R") is also created.

			MadeTech Definition:
			Trigger is still created when record is not found in PNC
			"""

	Background:
		Given the data for this test is not in the PNC
			And "input-message" is received

	@Should
	@PreProdTest
	Scenario: Trigger is still created when record is not found in PNC
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR16 - Forfeiture order" in the exception list table
			And I see exception "HO100301" in the exception list table
		When I open the record for "TRPRSIXTEEN TRIGGER"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0016" for offence "1"
			And I see trigger "TRPR0016" for offence "2"
		When I click the "PNC Errors" tab
		Then I see "I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (11/01ZD/01/410843C) NOT FOUND" in the "Error" row of the results table
