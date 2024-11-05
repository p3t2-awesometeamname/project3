const { User, GameResult } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate('gameResults');
        return user;
      }

      throw AuthenticationError;
    },
    users: async () => {
      return User.find({});
    },
    userById: async (parent, { _id }) => {
      return User.findById(_id).populate('gameResults');
    },
    gameResults: async () => {
      return GameResult.find({}).populate('winningPlayer losingPlayer players');
    },
    gameResult: async (parent, { _id }) => {
      return GameResult.findById(_id).populate('winningPlayer losingPlayer players');
    }
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
    addGameResult: async (parent, args) => {
      const gameResult = await GameResult.create(args);
      await User.updateMany(
        { _id: { $in: args.players } },
        { $push: { gameResults: gameResult._id } }
      );
      return gameResult.populate('winningPlayer losingPlayer players');
    }
  },
};

module.exports = resolvers;