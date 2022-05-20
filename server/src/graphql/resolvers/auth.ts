/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import User from '../../models/user';

type CreateUserArgType = {
  userInput: { email: string; password: string };
};

type UserLoginArgType = {
  email: string;
  password: string;
};

export default {
  createUser: async (args: CreateUserArgType) => {
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error('User already exists');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await newUser.save();
      console.log(result);
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  login: async ({ email, password }: UserLoginArgType) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User does not exist');
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Password is incorrect');
      }
      // jsonwebtoken sign with a large secret key
      const token = jsonwebtoken.sign(
        { userId: user.id, email: user.email },
        'supersecretkey',
        {
          expiresIn: '1h',
        },
      );
      return {
        userId: user.id,
        token,
        tokenExpiration: 1,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
