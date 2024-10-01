Feature: {028} R5.6_BR7 Driver Disqualification - Duration and Date values

			"""
			{028} R5.6_BR7 Driver Disqualification - Duration and Date values
			===============
			Q-Solution Definition:
			A Bichard7 Regression Test verifying Driver Disqualification handling and automation of results where Date and Duration values are received from Court.
			A 1st set of (Adjourment With Judgement) Court Hearing results are sent through the CJSE and onto Bichard7.
			A PNC Update is generated and the results from Court (Interim Disqualification) are successfully and automatically added onto the PNC.
			A PRE Trigger is also successfully created on the Portal.
			A 2nd set of (Sentence) Court Hearing results are sent through the CJSE and onto Bichard7.
			Hearing Outcome XML is successfully created based on ResultedCaseMessage contents.
			The substantive result received (3070 - Disqualified from Driving - Obligatory) contains Duration and (Start) Date values.
			In addition an ancillary result (3050 - Disqualification from Driving Reduced if Course Completed) is also received.
			A PNC Update is generated and the results from Court are successfully and automatically added onto the PNC.
			A PRE Trigger is also successfully created on the Portal.

			MadeTech Definition:
			Verification of Driver Disqualification handling where only a Duration is received from the Court
			"""

	Background:
		Given the data for this test is in the PNC

	@Should @NextUI
	Scenario: Driver Disqualification handling when only a Duration is received
		Given I am logged in as "supervisor"
		When "input-message-1" is received
			And I view the list of exceptions
		Then I see trigger "PR01 - Disqualified driver" in the exception list table
			And there are no exceptions raised for "Jimbobjones Bobby"
		When "input-message-2" is received
			And I view the list of exceptions
		Then I see trigger "PR01 - Disqualified driver" in the exception list table
			And there are no exceptions raised for "Jimbobjones Bobby"
			And the PNC updates the record
