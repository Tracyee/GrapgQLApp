/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import mongoose from 'mongoose';
import Event from './models/event';

const app = express();

type ArgType = {
  eventInput: {
    title: string;
    description: string;
    price: number;
    date: string;
  };
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

      input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
      }

      type RootQuery {
        events: [Event!]!
      }

      type RootMutation {
        createEvent(eventInput: EventInput!): Event
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
      createEvent: async (args: ArgType) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        try {
          const result = await event.save();
          console.log(result);
          return { ...result._doc };
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
