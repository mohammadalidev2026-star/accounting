import { gql } from "@apollo/client";

export const ADMIN_CUSTOMERS = gql`
  query adminCustomers($term: String) {
    adminCustomers(term: $term) {
      _id
      fullName
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;
