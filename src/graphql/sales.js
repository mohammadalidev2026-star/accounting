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
