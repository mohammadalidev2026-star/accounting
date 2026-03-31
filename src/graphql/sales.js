import { gql } from "@apollo/client";

export const SALES = gql`
  query sales(
    $paginationInput: PaginationInput!
    $filterInput: FilterSalesInput
  ) {
    sales(paginationInput: $paginationInput, filterInput: $filterInput) {
      edges {
        product {
          _id
          name
        }
        _id
        code
        count
        price
        description
        totalAmount
        createdAt
        updatedAt
      }
      pageInfo {
        totalCount
        totalPages
        hasNextPage
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
