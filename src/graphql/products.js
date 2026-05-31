import { gql } from "@apollo/client";

export const PRODUCTS = gql`
  query products(
    $paginationInput: PaginationInput!
    $filterInput: FilterProductsInput
  ) {
    products(paginationInput: $paginationInput, filterInput: $filterInput) {
      edges {
        _id
        name
        price
        description
        inStockCount
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

export const CREAT_PRODUCT = gql`
  mutation createProduct(
    $name: String!
    $price: Float!
    $description: String!
    $inStockCount: Int!
  ) {
    createProduct(
      input: {
        name: $name
        price: $price
        description: $description
        inStockCount: $inStockCount
      }
    ) {
      success
      message
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation updateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
      message
    }
  }
`;
