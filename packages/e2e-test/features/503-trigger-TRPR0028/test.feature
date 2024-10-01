Feature: {503} Trigger TRPR0028

	Background:
		Given the data for this test is in the PNC
			And "input-message" is received

@Should
	Scenario: Should generate trigger TRPR0028 when reallocating a case that only has TRPR0027 unresolved trigger
		Given I am logged in as "supervisor"
			And I view the list of exceptions
		When I open this record
			And I click the "Triggers" tab
		Then I see trigger "TRPR0003" for offence "1"
			And I see trigger "TRPR0004" for offence "1"
			And I see trigger "TRPR0004" for offence "2"
			And the PNC updates the record
		When I select trigger "2" to resolve
			And I select trigger "3" to resolve
			And I resolve the selected triggers
		Then I see trigger "TRPR0003" for offence "1"
			And I see complete trigger "TRPR0004" for offence "1"
			And I see complete trigger "TRPR0004" for offence "2"
		When I reallocate the case to "Merseyside"
			And I open this record
			And I click the "Triggers" tab
		Then I see trigger "TRPR0003" for offence "1"
			And I see complete trigger "TRPR0004" for offence "1"
			And I see complete trigger "TRPR0004" for offence "2"
			And I see trigger "TRPR0027"
		When I select trigger "1" to resolve
			And I resolve the selected triggers
		Then I see complete trigger "TRPR0003" for offence "1"
			And I see complete trigger "TRPR0004" for offence "1"
			And I see complete trigger "TRPR0004" for offence "2"
			And I see trigger "TRPR0027"
		When I reallocate the case to "Metropolitan"
			And I open this record
			And I click the "Triggers" tab
			And I see trigger "TRPR0028"
