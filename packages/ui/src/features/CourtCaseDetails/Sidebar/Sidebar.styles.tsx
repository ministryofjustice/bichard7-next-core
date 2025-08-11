import styled from "styled-components"

const SidebarContainer = styled.div`
  margin-top: -41px;

  .govuk-tabs__panel {
    border: 1px solid #b1b4b6;
    border-top: none;
    padding: 30px 20px;
  }

  .govuk-tabs__panel--hidden {
    display: none;
  }

  #pnc-details {
    padding: 0;
  }
`

const TabHeaders = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  line-height: 1.3157894737;
  border-bottom: 1px solid #b1b4b6;
  margin-bottom: 0;

  li {
    flex: 1;
    margin-left: 0;
    margin-right: 5px;
    text-align: center;
    line-height: 1.3157894737;
  }

  li:last-child {
    margin-right: 0;
  }

  li > a {
    cursor: pointer;
    text-decoration: underline;
    font-size: var(--case-details-default-font-size);
    margin-bottom: 0;

    &:link {
      color: #222;
    }
  }

  .govuk-tabs__list-item {
    margin-bottom: 5px;
    margin-top: 5px;
    box-sizing: border-box;
    padding: 10px 20px;

    &::before {
      content: "";
      margin-left: 0;
      padding-right: 0;
    }
  }

  .govuk-tabs__list-item--selected {
    margin-bottom: 0;
    margin-top: 0;
    padding: 14px 19px 16px;
    border: 1px solid #b1b4b6;
    border-bottom: none;

    a {
      font-weight: bold;
      text-decoration: none;
    }
  }
`

export { SidebarContainer, TabHeaders }
