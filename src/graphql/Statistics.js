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

export const ADMIN_BACKUP_DATABASE = gql`
  mutation adminBackupDatabase {
    adminBackupDatabase {
      success
      message
    }
  }
`;
