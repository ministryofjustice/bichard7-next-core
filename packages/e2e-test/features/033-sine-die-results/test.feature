Feature: {033} R3.3_BR7_Sine Die_Add Result Code 3027

			"""
			{033} R3.3_BR7_Sine Die_Add Result Code 3027
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Sine Die and Reinstated Sine Die handling.
			Court Hearing Results are sent through the CJSE and onto Bichard7 containing Offences that are all resulted Sine Die (2007) generating PRE Update Triggers and an Update of the PNC.
			Subsequent Court Hearing Result are sent through the CJSE and onto Bichard7 with Reinstated Sine Die results.
			Some of the Offences include a '3027 Reinstate Adjourned Sine Die' result and some do not.
			In all cases the solution ensures that a 3027 disposal together with the date of the original conviction - as provided in the ADJ segment received in the PNC enquiry - are included in the PNC Update that is generated and updated on PNC.

			MadeTech Definition:
			Correctly handling Sine Die results
			"""

	Background:
		Given the data for this test is in the PNC

	@Could @NextUI
	Scenario: Correctly handling Sine Die results
		Given I am logged in as "supervisor"
		When "input-message-1" is received
			And I view the list of exceptions
		Then I see trigger "PR17 - Adjourned sine die" in the exception list table
			And there are no exceptions raised for "Lebowski Jeffrey"
		When I open the record for "Lebowski Jeffrey"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0017" for offence "1"
			And I see trigger "TRPR0017" for offence "2"
			And I see trigger "TRPR0017" for offence "3"
		When "input-message-2" is received
		Then the PNC updates the record
