Feature: {000} Spike
  Background:
    Given the data for this test is in LEDS
    And "input-message" is received

  @Must
  @Parallel
  Scenario: Exceptions and triggers are created for a "stop list" message
    Given I am logged in as "generalhandler"
    And I view the list of exceptions
    Then I see exception "HO200212" for this record in the exception list
    When I open this record
    And I click the "Triggers" tab
    Then I see trigger "TRPR0001" for offence "1"
    And I see trigger "TRPR0001" for offence "3"
    And I see trigger "TRPR0006"
    And I see trigger "TRPR0012"
    When I click the "Offences" tab
    And I view offence "2"
    Then I see "2509" in the "CJS Code" row of the results table
    And the PNC record has not been updated
