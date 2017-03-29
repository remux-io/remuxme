const express = require('express');
const graphqlHTTP = require('express-graphql');
const processorSchema = require('./graphql-schema')
const jsonfile = require('jsonfile');
const path = require('path');

const app = express();

var config_json = jsonfile.readFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','remux.json')))


config_json = config_json || {}
config_json.ssl = config_json.ssl || false
config_json.host = config_json.host || '127.0.0.1'
config_json.port = config_json.port || 4000
config_json.debugGraphiQL = config_json.debugGraphiQL || false


app.use('/', graphqlHTTP({
  schema: processorSchema,
  graphiql: config_json.debugGraphiQL
}));


app.listen( config_json.port, config_json.host);
