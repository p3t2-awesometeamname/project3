import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
      user {
        _id
      }
    }
  }
`;


export const CREATE_GAME = gql`
  mutation createGame($gameData: GameInput!) {
    createGame(gameData: $gameData) {
      _id
      gameStatus
    }
  }
`;

export const UPDATE_GAME = gql`
  mutation UpdateGame($_id: ID!, $gameData: GameInput!) {
    updateGame(_id: $_id, gameData: $gameData) {
      _id
      lobbyName
      gamesSelection
      hostUser {
        _id
        firstName
        email
      }
      opponentUser {
        _id
        firstName
        email
      }
      gameStatus
      gameBoard
    }
  }
`;

export const DELETE_GAME = gql`
  mutation DeleteGame($_id: ID!) {
    deleteGame(_id: $_id) {
      _id
    }
  }

`;


export const UPDATE_USER = gql`
  mutation updateUser($tictactoewins: Int, $tictactoelosses: Int) {
    updateUser(tictactoewins: $tictactoewins, tictactoelosses: $tictactoelosses) {
      _id
      firstName
      lastName
      email
      tictactoewins
      tictactoelosses
    }
  }
`;

