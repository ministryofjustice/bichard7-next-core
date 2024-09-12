Feature: {158} BR7 R5.2.2-RCD518 - Result class Sentence & Adjournment Post Judgement

			"""
			{158} BR7 R5.2.2-RCD518 - Result class Sentence & Adjournment Post Judgement
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Breach Results automation (Adjournment With Judgement, Adjournment Post Judgement and Sentence).
			- Message 1: All Offences Adjourned with Judgement (NEWREM & DISARR)
			PNC Updates are generated and the Court Hearing Results are successfully added automatically onto the PNC.
			- Message 2: Offence 1 = Adjourned Post Judgment (NEWREM), Offence 2 = Sentenced (SENDEF)
			An Exception is created, correct and resubmitted from the Portal.
			A 2nd Exception is created since there are now incompatible PNC Message Types (NEWREM & SENDEF) and these cannot both be used to update the same single CCR Group.
			Verification is made of the Breach updates to the PNC.
			Pre Update Triggers are generated.
			In addition the Breach Trigger is created for Offence 2 only since this Offence is being Sentenced at this point.

			MadeTech Definition:
			Breach results automation
			"""

	Background:
		Given the data for this test is in the PNC

	@Should @NextUI
	Scenario: Breach results automation
		Given "input-message-1" is received
			And I am logged in as "supervisor"
			And I view the list of exceptions
		Then there are no exceptions or triggers
		When "input-message-2" is received
		Then I see exception "HO100310" in the exception list table
		When I open the record for "DDDraven Alex"
			And I click the "Offences" tab
			And I view offence "1"
			And I match the offence to PNC offence "1"
			And I return to the offence list
			And I view offence "2"
			And I match the offence to PNC offence "2"
			And I submit the record
			And I return to the list
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And I see exception "HO200113" in the exception list table
		When I open the record for "DDDraven Alex"
			And I click the "Triggers" tab
		Then I see trigger "TRPR0020" for offence "2"
			And I see trigger "TRPR0006"
			And the PNC updates the record
