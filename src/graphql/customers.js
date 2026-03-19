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

export const ADMIN_CREATE_CUSTOMER = gql`
  mutation adminCreateCustomer($fullName: String!, $phoneNumber: String!) {
    adminCreateCustomer(
      input: { fullName: $fullName, phoneNumber: $phoneNumber }
    ) {
      success
      message
    }
  }
`;

export const ADMIN_DELETE_CUSTOMER = gql`
  mutation adminDeleteCustomer($id: ID!) {
    adminDeleteCustomer(id: $id) {
      success
      message
    }
  }
`;

export const ADMIN_UPDATE_CUSTOMERS = gql`
  mutation adminUpdateCustomer(
    $id: ID!
    $fullName: String!
    $phoneNumber: String
  ) {
    adminUpdateCustomer(
      input: { id: $id, fullName: $fullName, phoneNumber: $phoneNumber }
    ) {
      success
      message
    }
  }
`;
