const http = require('http');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const jsonfile = require('jsonfile');
const path = require('path');
const socketio = require('socket.io')

const processorSchema = require('./graphql-schema');
const remuxme_pm2_api = require('./remuxme-pm2')
const config = require('./config');
const Logs = require('./logs');


var app = express();

var config_json = config.remux.read_json()
config_json = config_json || {}
config_json.ssl = config_json.ssl || false
config_json.host = config_json.host || '127.0.0.1'
config_json.port = config_json.port || 4000
config_json.debugGraphQL = config_json.debugGraphQL || false


app.use('/', graphqlHTTP({
  schema: processorSchema,
  graphiql: config_json.debugGraphQL
}));


var server = http.createServer(app)
var io = socketio(server)

var logs = new Logs(io)

io.on('connection', function (socket) {

  socket.on('join', function (id) {
    var api = new remuxme_pm2_api();
    api.list({},function(err, result){

      var proc = result.find(function(item){
        if (!item){
          return false
        }else if(!item.status){
          return false
        }else if(item.id == id){
          return true
        }else{
          return false
        }
      })

      try{
        socket.join(proc.status.id.toString());
      }catch(e){
        console.log(e);
      }
    })
  });

  socket.on('leave', function (id) {
    var api = new remuxme_pm2_api();
    api.list({},function(err, result){

      var proc = result.find(function(item){
        if (!item){
          return false
        }else if(!item.status){
          return false
        }else if(item.id == id){
          return true
        }else{
          return false
        }
      })
      try{
        socket.leave(proc.status.id.toString());
      }catch(e){
        console.log(e)
      }
    })
  });
});

server.listen( config_json.port, config_json.host);
