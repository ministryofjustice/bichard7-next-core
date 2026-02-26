import styled from "styled-components"

const ReportSelectionFilterWrapper = styled.div`
  .include-section-wrapper {
    flex: 1 1 250px;
    min-width: 150px;

    .checkboxes-wrapper {
      display: flex;

      .govuk-checkboxes__item {
        margin: 0;
        flex: 1 1 150px;
        min-width: 150px;
        max-width: 200px;
      }

      .govuk-checkboxes__input {
        width: 40px;
        height: 40px;
      }

      .govuk-checkboxes__label::before {
        top: 0px;
        left: 0px;
      }

      .govuk-checkboxes__label::after {
        top: 11px;
        left: 9px;
      }
    }
  }

  .reports-section-wrapper {
    flex: 1 1 250px;
    min-width: 150px;
  }

  .date-range-section-wrapper {
    flex: 1 1 475px;
    min-width: 150px;
    justify-content: space-between;
    flex-direction: row;

    .date {
      min-width: 150px;
      flex: 1 1 150px;

      &:first-child {
        margin-right: 25px;
      }
    }

    .date-to-wrapper {
      float: right;
    }

    .date-from-wrapper {
      float: left;
    }

    .calendars-wrapper {
      display: flex;
      flex-wrap: nowrap;
    }
  }

  .fields-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 50px;
    width: 100%;
    align-items: flex-start;
    padding-left: 30px;
    padding-right: 30px;
    box-sizing: border-box;
  }

  .bottom-actions-bar {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
    width: 100%;

    .clear-search-link {
      margin-right: 44px;
    }

    .search-button {
      margin: 0;
    }
  }

  .select-report-field {
    width: 100%;
  }
`

export { ReportSelectionFilterWrapper }
