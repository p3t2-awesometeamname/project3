const typeDefs = `
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    gameResults: [GameResult]
  }

  type GameResult {
    _id: ID
    gameType: String
    winningPlayer: User
    losingPlayer: User
    draw: Boolean
    players: [User]
    date: String
    additionalInfo: String
  }
  
  type Auth {
    token: ID
    user: User
  }

  type Query {
    user: User
    users: [User]
    userById(_id: ID!): User
    gameResults: [GameResult]
    gameResult(_id: ID!): GameResult
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    updateUser(firstName: String, lastName: String, email: String, password: String, tictactoewins: Int, tictactoelosses: Int): User
    login(email: String!, password: String!): Auth
    addGameResult(gameType: String!, winningPlayer: ID, losingPlayer: ID, draw: Boolean!, players: [ID]!): GameResult

    }
`;

module.exports = typeDefs;