import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();

type Event = {
  _id: string;
  title: string;
  description: string;
  price: number;
  date: string;
};

type ArgType = {
  eventInput: Omit<Event, '_id'>;
};

const events: Event[] = [];

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
      events: () => events,
      createEvent: (args: ArgType) => {
        const event: Event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date).toISOString(),
        };
        events.push(event);
        return event;
      },
    },
    graphiql: true,
  }),
);

app.listen(4000);
