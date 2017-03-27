const express = require('express');
const graphqlHTTP = require('express-graphql');
const processorSchema = require('./graphql-schema')

const app = express();

app.use('/', graphqlHTTP({
  schema: processorSchema,
  graphiql: true
}));

app.listen(4000);
