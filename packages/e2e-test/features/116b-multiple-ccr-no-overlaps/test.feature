Feature: {116b} BR7 R5.1-238-414-Multiple CCR-Adjudications-Existing Results

			"""
			{116} BR7 R5.1-238-414-Multiple CCR-Adjudications-Existing Results
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying multiple CCR Group processing where there are no Offence 'overlaps', there are other Offences that have already been resulted with an Adjudication and Court Hearing Results received contain an Adjudication and/or Sentencing.
			Specifically, verification that certain PNC Message Type combinations can be generated and used to update the PNC where the following sets of Court Hearing Results are received:
			- 1st set of Results containing Dismissed and Adjourned Offences
			- 2nd set of Results containing Adjudications and Sentences
			- 3rd set of Results containing Dismissed and Adjourned Offences
			- 4th set of Results containing Adjudications and Sentences
			As part of this Test Pre Update Triggers are also created.

			MadeTech Definition:
			Multiple CCR with no offence overlaps

			Note: this test uses the same PNC record as test 119. As it is a pre-existing record in the PNC we can only run one of these tests a day
			"""

	Background:
		Given the data for this test is in the PNC

	@Should @ExcludeOnPreProd @NextUI
	Scenario: Multiple CCR with no offence overlaps
		Given "input-message-1" is received
			And I wait "2" seconds
			And "input-message-2" is received
			And I am logged in as "supervisor"
		Then the PNC updates the record
		When I view the list of exceptions
		Then I see trigger "PR06 - Imprisoned" in the exception list table
			And there are no exceptions
