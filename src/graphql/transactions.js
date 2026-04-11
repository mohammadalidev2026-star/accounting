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
        code
        count
        price
        totalAmount
        description
        createdAt

        customer {
          _id
          fullName
        }
        product {
          _id
          name
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
  mutation adminCreateTransaction($input: CreateTransactionInput!) {
    adminCreateTransaction(input: $input) {
      success
      message
    }
  }
`;

export const ADMIN_UPDATE_TRANSACTION = gql`
  mutation adminUpdateTransaction($input: UpdateTransactionInput!) {
    adminUpdateTransaction(input: $input) {
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
