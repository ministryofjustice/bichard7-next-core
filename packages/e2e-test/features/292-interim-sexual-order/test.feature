Feature: {292} BR7-R5.9-Interim Sexual Order

			"""
			{292} BR7-R5.9-Interim Sexual Order
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Interim Sexual Order Results and Trigger generation.
			Magistrates Court Hearing Results (Adjournment With Judgement) are sent through the CJSE and onto Bichard7 for a Sexual Offence.
			A PNC Update is generated and the Interim Results from Court (Interim Sexual Risk Order) are successfully and automatically added onto the PNC.
			A PRE Update Trigger is also successfully created on the Portal.

			MadeTech Definition:
			Handling interim sexual order results
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Handling interim sexual order results
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR04 - Sex offender" in the exception list table
			And there are no exceptions raised for "SEXUALORDER Interim"
			And the PNC updates the record
