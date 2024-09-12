Feature: {242} BR7 R5.6-RCD562-Sine Die Results then Withdrawn

			"""
			{242} BR7 R5.6-RCD562-Sine Die Results then Withdrawn
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test which verifies those changes brought about as part of RCD entry #562.
			Court Hearing Results are sent through the CJSE and onto Bichard7 containing Offences that are all resulted Sine Die (2007) generating PRE Update Triggers and an update of the PNC.
			Subsequent Court Hearing Results are sent through the CJSE and onto Bichard7 Withdrawing all of the Offences (the Defendant has been Sentenced in Crown Court on a separate Case for a very long time and for far more serious Offences than those for which he is being charged here, hence the decision to Withdraw them).
			The information returned from the PNC Query includes the '2007' (Adjourned Sine Die) Results and so the only way the Final Results from Court can be updated on the PNC is via the SUBVAR PNC Message.
			The PNC is successfully updated and the Final Results from Court are automatically added to the PNC.

			MadeTech Definition:
			Withdrawn Sine Die results
			"""

	Background:
		Given the data for this test is in the PNC

	@Could @NextUI
	Scenario: Withdrawn Sine Die results
		Given I am logged in as "supervisor"
			And I view the list of exceptions
			And "input-message-1" is received
		Then I see trigger "PR17 - Adjourned sine die" in the exception list table
			And there are no exceptions raised for "SINEDIE WITHDRAWN"
		When I open the record for "SINEDIE WITHDRAWN"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0017" for offence "1"
			And I see trigger "TRPR0017" for offence "2"
		When I unlock the record and return to the list
			And "input-message-2" is received
		Then there should only be "1" records
			And the PNC updates the record
