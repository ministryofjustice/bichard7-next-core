Feature: {263} BR7 R5.7-RCD601-Result Code 2065 received after Defendant found Guilty

			"""
			{263} BR7 R5.7-RCD601-Result Code 2065 received after Defendant found Guilty
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Result Class calculation (Adjournment With Judgement & Judgement With Final Result) and Trigger generation.
			A 1st set of (Adjournment with Judgement) Court Hearing results are sent through the CJSE and onto Bichard7.
			A PNC Update is generated and the results from Court (Adjournment With Judgment) are successfully and automatically added onto the PNC.
			A 2nd set of (Final Result - Result Code '2065' - Defendant Dead) Court Hearing results are sent through the CJSE and onto Bichard7.
			The solution recognises that this is a Final Result and calculates the Result Class as Judgment With Final Result.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			A Pre Update Trigger is also successfully created on the Portal.

			MadeTech Definition:
			Defendant dies after being found guilty
			"""

	Background:
		Given the data for this test is in the PNC

	@Could @NextUI
	Scenario: Defendant dies after being found guilty
		Given I am logged in as "supervisor"
			And I view the list of exceptions
			And "input-message-1" is received
		Then there are no exceptions or triggers
		When "input-message-2" is received
		Then there are no exceptions raised for "POSTADJUDICATION Passaway"
			And I see exception "PR07 - Defendant dead" in the exception list table
			And the PNC updates the record
