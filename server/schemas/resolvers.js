const { User, Game } = require('../models');
const {signToken} = require('../utils/auth');
// require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);
        return user;
      }

      throw AuthenticationError;
    },
    users: async () => {

        return User.find({});
    },
    game: async (parent, { id }) => {
      try {
        return await Game.findById(id).populate('hostUser').populate('opponentUser');
      } catch (err) {
        console.log('Error in game resolver:', err);
        throw new Error('Failed to fetch game');
      }
    },
    games: async () => {
      return await Game.find({});
      // return await Game.find({}).populate('hostUser');
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, {
          new: true,
        });
      }

      throw AuthenticationError;
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    createGame: async (parent, {gameData}) => {
      return await Game.create(gameData);
    },
    updateGame: async (parent, {gameData}) => {
      return await Game.findByIdAndUpdate(gameData._id, gameData, { new: true });
    },
    deleteGame: async (parent, { _id }) => {
      return await Game.findByIdAndDelete(_id);
    },
   },
};

module.exports = resolvers;