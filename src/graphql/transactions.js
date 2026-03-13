import { gql } from "@apollo/client";

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
