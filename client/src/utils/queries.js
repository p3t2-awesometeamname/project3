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

// export const QUERY_GAME = gql`
//   {
//     game {
//       _id
//     }
//   }
// `;



export const QUERY_GAME = gql`
{
     game{
    lobbyName
    gamesSelection
    hostUser {
      firstName
      _id
    }
    opponentUser {
      firstName
      _id
    }
  }
}
`;

// Games

// export const QUERY_GAMES = gql`
//   {
//     games {
//       _id
//       lobbyName
//       hostUser
//       gamesSelection
//     }
//   }
// `;

export const QUERY_GAMES = gql`
  query GetGames {
    games {
      _id
      lobbyName
      gamesSelection
      hostUser {
        firstName
        lastName
      }
    }
  }
`;
