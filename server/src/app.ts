import express from 'express';

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// send a GET request to http://localhost:4000/
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(4000);
