import { gql } from "@apollo/client";

export const SALES = gql`
  query sales(
    $paginationInput: PaginationInput!
    $filterInput: FilterSalesInput
  ) {
    sales(paginationInput: $paginationInput, filterInput: $filterInput) {
      edges {
        products {
          product {
            _id
            name
          }
          count
          price
          buyPrice
        }
        customer {
          _id
          fullName
        }
        _id
        code
        income
        description
        totalAmount
        remainingBalance
        createdAt
        updatedAt
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

export const CREATE_SALES = gql`
  mutation createSale($input: CreateSaleInput!) {
    createSale(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_SALES = gql`
  mutation updateSale($input: UpdateSaleInput!) {
    updateSale(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_SALE = gql`
  mutation deleteSale($id: ID!) {
    deleteSale(id: $id) {
      success
      message
    }
  }
`;

export const SALE = gql`
  query sale($id: ID!) {
    sale(id: $id) {
      products {
        product { _id, name, price }
        count
        price
        buyPrice
      }
      customer { _id, fullName }
      _id
      code
      income
      description
      totalAmount
      remainingBalance
      createdAt
      updatedAt
    }
  }
`;
