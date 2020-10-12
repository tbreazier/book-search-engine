const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')

          return userData;
        }
      
        throw new AuthenticationError('Not logged in');
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
      
        return { token, user };
      },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
        const correctPw = await user.isCorrectPassword(password);
        const token = signToken(user);

        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
      
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
      
        return { token, user };
        },
    saveBook: async (parent, {input}, context) => {
        if (context.user) {
            const saveUserBooks = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $push: { savedBooks: input } },
                { new: true}
            );
            return { saveUserBooks };
        }
        throw new AuthenticationError('Not logged in');
    },
    deleteBook: async (parent, {bookId}, context) => {
        const saveUserBooks = await User.findByIdAndDelete(
            { _id: context.user._id },
            { $pull: { savedBooks: {bookId: bookId} } },
            { new: true}
        )
        return saveUserBooks;
    }
  }
};

module.exports = resolvers;