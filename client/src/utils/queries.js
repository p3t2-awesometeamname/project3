import { gql } from '@apollo/client';

// Users

export const QUERY_USER = gql`
  {
    user {
      firstName
      lastName
    }
  }
`;

export const QUERY_USERS = gql`
  {
    users {
        _id
        firstName
        lastName
        email
    }
}
`;

// Games

export const QUERY_GAMES = gql`
  {
    games {
      _id
    }
  }
`;
