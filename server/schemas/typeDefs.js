const typeDefs = `
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    gameResults: [GameResult]

  }
    
  type Game {
    _id: ID!
    lobbyName: String
    gamesSelection: String
    hostUser: User
    opponentUser: User
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

  input UserInput {
    _id: ID
    firstName: String
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
    userById(_id: ID!): User
    gameResults: [GameResult]
    gameResult(_id: ID!): GameResult
    game(id: ID!): Game
    games: [Game]
  }



  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    updateUser(firstName: String, lastName: String, email: String, password: String, tictactoewins: Int, tictactoelosses: Int): User
    login(email: String!, password: String!): Auth
    addGameResult(gameType: String!, winningPlayer: ID, losingPlayer: ID, draw: Boolean!, players: [ID]!): GameResult
    createGame(gameData: GameInput!): Game
    updateGame(_id: ID!, gameData: GameInput!): Game
    deleteGame(_id: ID!): Game
    updateGameOpponent(gameId: ID!): Game
  }
`

module.exports = typeDefs;