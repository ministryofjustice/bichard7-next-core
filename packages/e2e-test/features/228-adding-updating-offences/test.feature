Feature: {228} BR7-R5.5-RCD576-PNC_No_Adj-Existing_Offences_Adj_Pre_Judg-Offence_Added_Judg_With_Final_Result

			"""
			{228} BR7-R5.5-RCD576-PNC_No_Adj-Existing_Offences_Adj_Pre_Judg-Offence_Added_Judg_With_Final_Result
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Offences Added in Court behaviour as follows:
			Current PNC Status = No Adjudication exists
			Existing Offences are resulted as: Adjournment Pre Judgement
			An Offence Added in Court is resulted as: Judgement With Final Result
			The Offence Added in Court can be added to the PNC and a Trigger is also generated as a result.
			The PNC is successfully updated with Court Hearing Results.

			MadeTech Definition:
			Adding offences as well as updating existing offences
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should
	@NextUI
	Scenario: Adding offences as well as updating existing offences
		Given I am logged in as "generalhandler"
		When I view the list of exceptions
			And the PNC updates the record
		Then I see trigger "PS10 - Offence added to PNC" in the exception list table
			And there are no exceptions raised for "ADDEDOFFENCEJWFTHREE Nopncadj"
