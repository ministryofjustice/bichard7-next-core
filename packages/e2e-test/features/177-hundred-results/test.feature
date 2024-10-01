Feature: {177} BR7 R5.3-RCD497 - 100x Results Match - Different Order

			"""
			{177} BR7 R5.3-RCD497 - 100x Results Match - Different Order
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Identical Offence Matching where Results received are identical but are in a different order for each of the 100 Offences.
			Specifically:
			- 100 identical Offences and Results are received from Court but the Court Results for each Offence appear in a different order
			The solution recognises the Offences and their associated results as identical (irrespective of how the results for each Offence have been ordered) and an update to the PNC is successfully generated.
			Pre Update Triggers are created on the Portal.

			MadeTech Definition:
			Matching 100 identical results
			"""

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

	@Could
	Scenario: Matching 100 identical results
		Given I am logged in as "generalhandler"
			And I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And there are no exceptions raised for "Atwood Marcus"
			And the PNC updates the record
