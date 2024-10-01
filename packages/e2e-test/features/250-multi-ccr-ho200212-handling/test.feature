Feature: {250} BR7 R5.6-RCD459-Multi CCR HO200212 handling

			"""
			{250} BR7 R5.6-RCD459-Multi CCR HO200212 handling
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies those changes brought about as part of RCD entry #459.
			This test will confirm the changes to the Bichard7 solution to revise the conditions surrounding which the Exception HO200212 (Offence has no valid PNC results) is generated.
			Court Hearing results are sent through the CJSE and onto Bichard7 for a Case on the PNC which has multiple CCR Groups.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The Further Offences are Sentenced and the Breach (received from Court as an Offence Added in Court as Offence Code 'CJ03507') is dealt with by Re-Sentencing the original Offence under Result Code '3501'.
			'3501' is a Result Code that is not accepted by the PNC and is therefore stripped off the PNC Update by the solution.
			This results in an Offence with no Results but NO Exception is generated since this will be indicated to the User via the Post Update Trigger TRPS0011.
			The other Offence Added in Court (Offence Code 'CJ03522' - Original Offence Re-Sentenced) is ignored by the Bichard7 solution since its Offence Category (B7) is in the Stop List of Offence Categories NOT to be added to the PNC.
			PNC Update is generated for the Sentencing and the PNC is successfully updated.
			Pre Update Triggers are also created.

			MadeTech Definition:
			Multi CCR HO200212 handling
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Should @NextUI
	Scenario: Multi CCR HO200212 handling
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then I see trigger "PS11" in the exception list table
			And there are no exceptions raised for "NOEXCEPTION AddedOffence"
		When I open the record for "NOEXCEPTION AddedOffence"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0006"
			And I see trigger "TRPR0020" for offence "3"
			And I see trigger "TRPR0020" for offence "4"
			And I see trigger "TRPS0011" for offence "3"
			And the PNC updates the record
