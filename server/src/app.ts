/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Event from './models/event';
import User from './models/user';

const app = express();

type CreateEventArgType = {
  eventInput: {
    title: string;
    description: string;
    price: number;
    date: string;
  };
};

type CreateUserArgType = {
  userInput: { email: string; password: string };
};

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
      type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type User {
        _id: ID!
        email: String!
        password: String
      }

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      input UserInput {
        email: String!
        password: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
      }

      schema {
        query: RootQuery
        mutation: RootMutation
      }
    `),
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find();
          return events.map(event => ({
            ...event._doc,
          }));
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
      createEvent: async (args: CreateEventArgType) => {
        try {
          const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '6280849465662c5b31dc5d21',
          });
          const result = await event.save();
          const user = await User.findById('6280849465662c5b31dc5d21');
          if (!user) {
            throw new Error('User not found');
          }
          user.createdEvents.push(event);
          await user.save();
          console.log(result);
          return { ...result._doc };
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
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
          return { ...result._doc, password: null };
        } catch (err) {
          console.log(err);
          throw err;
        }
      },
    },
    graphiql: true,
  }),
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster-free-0.v4jfz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
  )
  .then(() => {
    app.listen(4000);
  })
  .catch(err => {
    // eslint-disable-next-line no-console
    console.log(err);
  });
