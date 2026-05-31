import { gql } from "@apollo/client";

export const STATISTICS = gql`
  query dashboardSummary {
    dashboardSummary(
      filterInput: { startDate: "", endDate: "", productId: "" }
    ) {
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
