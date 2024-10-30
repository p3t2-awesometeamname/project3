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
export const CREATE_GAME = gql`
  mutation createGame(
    $gameData: String!
  )
  {
    createGame(gameData: $gameData) {
    _id
      lobbyName
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
      gamesSelection
     
    }
  }`;
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
