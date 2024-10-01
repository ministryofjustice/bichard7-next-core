Feature: {112a} BR7 R5.1-RCD422-Breach with Further Offence-Suspended Sentence

			"""
			{112} BR7 R5.1-RCD422-Breach with Further Offence-Suspended Sentence
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Breach Offence handling where a Further Offence is charged, Exception and Trigger generation.
			Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents, successful queried response from PNC and also from static data tables held within the Exchange-hosted solution.
			The Further Offence is Sentenced and the Breach (received from Court as Offence Code 'CJ03507') is dealt with by Re-Sentencing the original Offence under Result Code '3501'.
			'3501' is a Result Code that is not accepted by the PNC and is therefore stripped off the PNC Update by the solution.
			This results in an Offence with no Results but NO Exception is generated since this will be indicated to the User via the Post Update Trigger TRPS0011.
			The other Offence Added In Court (Offence Code 'CJ03522' - Original Offence Re-Sentenced) is ignored by the Bichard7 solution since its Offence Category (B7) is in the Stop List of Offence Categories and is NOT to be added to the PNC.
			PNC Update is generated for the Sentencing and the PNC is successfully updated.
			Pre Update Triggers are also created.

			MadeTech Definition:
			Breach offence handling where a further offence is charged
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could @NextUI
	Scenario: Breach offence handling where a further offence is charged
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		Then the PNC updates the record
			And there are no exceptions or triggers
