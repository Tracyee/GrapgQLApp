import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import mongoose from 'mongoose';

import eventBookingSchema from './graphql/schema/index';
import eventBookingResolvers from './graphql/resolvers/index';

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: eventBookingSchema,
    rootValue: eventBookingResolvers,
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
