import User from '../models/index.js';
import {signToken} from '../services/auth.js';

interface UserContext {
  user: {
    _id: string;
  };
}
interface LoginParams {
  email: string;
    password: string;
}
const resolvers= {
  Query: {
    me: async (_parent: any, _args: any, context: UserContext) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      throw new Error('You need to be logged in!');
    },
  },
  Mutation: {
    login: async (_parent: any, { email, password }: LoginParams) => {
      const
      user = await User.findOne({ email });
      if (!user) {
        throw new Error('Incorrect credentials');
      }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new Error('Incorrect credentials');
        }
        const token = signToken(user.username, user.email, user._id);
        return { token, user };
    },
    addUser: async (_parent: any, args: any) => {
      const user = await User.create(args);
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_parent: any, args: any, context: UserContext) => {
        console.log(context.user)
      if (context.user) {
        const updatedUser =
        await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args } },
            { new: true, runValidators: true }
            );
            return updatedUser;
      } throw new Error('You need to be logged in!');
    },
    removeBook: async (_parent: any, { bookId }: any, context: UserContext) => {
      if (context.user) {
        const updatedUser =
        await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true }
            );
            return updatedUser;
      } throw new Error('You need to be logged in!');
},
    },
};
export default resolvers;