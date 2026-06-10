import { gql } from "@apollo/client";

export const TRANSACTIONS = gql`
  query transactions(
    $paginationInput: PaginationInput!
    $filterInput: TransactionFilterInput
  ) {
    transactions(paginationInput: $paginationInput, filterInput: $filterInput) {
      edges {
        _id
        code
        totalAmount
        remainingBalance
        description
        createdAt

        products {
          product {
            _id
            name
          }
          count
          price
        }

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

export const CREATE_TRANSACTION = gql`
  mutation createTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation updateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation deleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      success
      message
    }
  }
`;

export const TRANSACTION = gql`
  query transaction($id: ID!) {
    transaction(id: $id) {
      _id
      code
      totalAmount
      remainingBalance
      description
      createdAt
      products {
        product { _id, name, price }
        count
        price
      }
      customer { _id, fullName }
    }
  }
`;
