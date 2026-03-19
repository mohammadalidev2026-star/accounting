import { gql } from "@apollo/client";

export const ADMIN_TRANSACTIONS = gql`
  query adminTransactions(
    $paginationInput: PaginationInput!
    $filterInput: TransactionFilterInput
  ) {
    adminTransactions(
      paginationInput: $paginationInput
      filterInput: $filterInput
    ) {
      edges {
        _id
        amount
        currency
        description
        createdAt
        customer {
          _id
          fullName
        }
      }
      pageInfo {
        totalCount
        totalPages
        hasNextPage
        totalAmount
      }
    }
  }
`;

export const ADMIN_CREATE_TRANSACTION = gql`
  mutation adminCreateTransaction(
    $amount: Float!
    $currency: CurrencyEnum!
    $description: String
    $customerId: ID!
  ) {
    adminCreateTransaction(
      input: {
        amount: $amount
        currency: $currency
        description: $description
        customerId: $customerId
      }
    ) {
      success
      message
    }
  }
`;

export const ADMIN_UPDATE_TRANSACTION = gql`
  mutation adminUpdateTransaction(
    $id: ID!
    $customerId: ID!
    $amount: Float!
    $currency: CurrencyEnum!
    $description: String
  ) {
    adminUpdateTransaction(
      input: {
        id: $id
        customerId: $customerId
        amount: $amount
        currency: $currency
        description: $description
      }
    ) {
      success
      message
    }
  }
`;

export const ADMIN_DELETE_TRANSACTION = gql`
  mutation adminDeleteTransaction($id: ID!) {
    adminDeleteTransaction(id: $id) {
      success
      message
    }
  }
`;
