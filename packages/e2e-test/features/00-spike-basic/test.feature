Feature: {000} Spike - Phase 1 with just offences

    """
    This tests Phase 1 integration with LEDS simulator where offences without adjudications and disposals are returned.

    Based on {003} R3_BR7_TR_003_TRPR0012
    """

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
