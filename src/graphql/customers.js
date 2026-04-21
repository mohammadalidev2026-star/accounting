import { gql } from "@apollo/client";

export const CUSTOMERS = gql`
  query customers($term: String) {
    customers(term: $term) {
      _id
      fullName
      phoneNumber
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CUSTOMER = gql`
  mutation createCustomer($fullName: String!, $phoneNumber: String!) {
    createCustomer(input: { fullName: $fullName, phoneNumber: $phoneNumber }) {
      success
      message
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation deleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      success
      message
    }
  }
`;

export const UPDATE_CUSTOMERS = gql`
  mutation updateCustomer($id: ID!, $fullName: String!, $phoneNumber: String) {
    updateCustomer(
      input: { id: $id, fullName: $fullName, phoneNumber: $phoneNumber }
    ) {
      success
      message
    }
  }
`;
