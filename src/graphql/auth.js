import { gql } from "@apollo/client";

export const ADMIN_LOGIN = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(input: { email: $email, password: $password }) {
      accessToken
      refreshToken
      adminInfo {
        _id
        firstName
        lastName
        email
        profileImage
        role
        isEmailVerified
        lastLogin
        createdAt
        updatedAt
      }
    }
  }
`;
