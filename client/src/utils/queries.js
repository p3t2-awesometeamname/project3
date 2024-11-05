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
  query GetGame($id: ID!) {
    game(id: $id) {
      _id
      lobbyName
      gamesSelection
      hostUser {
        _id
        firstName
        lastName
        email
      }
      opponentUser {
        _id
        firstName
        lastName
        email
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
      opponentUser {
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_GAME_OPPONENT = gql`
  mutation UpdateGameOpponent($gameId: ID!) {
    updateGameOpponent(gameId: $gameId) {
      _id
      lobbyName
      gamesSelection
      hostUser {
        _id
        firstName
        lastName
      }
      opponentUser {
        _id
        firstName
        lastName
      }
    }
  }
`;
