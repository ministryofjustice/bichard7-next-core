Feature: {091} R4.1.1_BR7_Bail Condition Padding

			"""
			{091} R4.1.1_BR7_Bail Condition Padding
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Bail Condition handling and Results (Adjournment Pre Judgement) automation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The solution recognises that Bail Conditions are present in the Results from Court and ensures the 'padding' of each Bail Condition such that no words will be broken over 2x lines when the details are added onto the PNC.
			PNC Update is generated and the Court Hearing Results are successfully added automatically onto the PNC.
			Verification is made that no words with the Bail Conditions on PNC are broken over 2x lines.
			Pre Update Triggers are also generated.

			MadeTech Definition:
			The bail conditions are padded to make sure no words are split over two lines
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: The bail conditions are padded to make sure no words are split over two lines
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PR10 - Conditional bail" in the exception list table
			And the PNC updates the record
