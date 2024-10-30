const typeDefs = `
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
  }
    
  type Game {
    _id: ID
    lobbyName: String
    hostUser: User
    opponentUser: User
    gamesSelection: String
  }

  type Auth {
    token: ID
    user: User
  }

  input UserInput {
    _id: ID
    firstName: String
    lastName: String
    email: String
  }

  input GameInput {
    lobbyName: String!
    hostUser: UserInput!
    opponentUser: UserInput
    gamesSelection: String!
  }
  
  type Query {
    user: User
    users: [User]
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    updateUser(firstName: String, lastName: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
    createGame(gameData: GameInput!): Game

    updateGame(_id: ID!, gameData: GameInput!): Game
    deleteGame(_id: ID!): Game
  }
`

module.exports = typeDefs;
