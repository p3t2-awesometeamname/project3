const typeDefs = `
  type User {
    _id: ID
    firstName: String
    screenName: String
    email: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    user: User
    users: [User]
  }

  type Mutation {
    addUser(firstName: String!, screenName: String!, email: String!, password: String!): Auth
    updateUser(firstName: String, screenName: String, email: String, password: String): User
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
