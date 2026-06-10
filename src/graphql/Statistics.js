import { gql } from "@apollo/client";

export const STATISTICS = gql`
  query dashboardSummary($filterInput: DashboardFilterInput) {
    dashboardSummary(filterInput: $filterInput) {
      salesSummary {
        numberOfSalesRecords
        sumOfTotalAmount
        sumOfIncome
        totalRemainingBalance
      }
      transactionsSummary {
        numberOfTransactionsRecords
        sumOfTotalAmount
        totalRemainingBalance
      }
    }
  }
`;

export const ADMIN_BACKUP_DATABASE = gql`
  mutation adminBackupDatabase {
    adminBackupDatabase {
      success
      message
    }
  }
`;
