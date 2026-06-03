import { gql } from "@apollo/client";

export const STATISTICS = gql`
  query dashboardSummary($filterInput: DashboardFilterInput) {
    dashboardSummary(filterInput: $filterInput) {
      salesSummary {
        numberOfSalesRecords
        sumOfTotalAmount
        sumOfIncome
      }
      transactionsSummary {
        numberOfTransactionsRecords
        sumOfTotalAmount
      }
    }
  }
`;
