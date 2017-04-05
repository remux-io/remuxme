
"use strict"

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const socket_client = require('socket.io-client')
const config = require('./config.js');


const client_io = function(args){

  var api = this
  var config_json = config.remux.read_json()

  config_json = config_json || {}

  api.settings = args || {}
  api.settings.protocol = api.settings.protocol || 'http'
  api.settings.host = api.settings.host || config_json.host || '127.0.0.1'
  api.settings.port = api.settings.port || config_json.port || '4000'
  if (api.settings.host == "0.0.0.0") api.settings.host = "127.0.0.1"
  api.socket = null


  api.connect = function(){

    api.socket = socket_client(api.settings.protocol+'://'+api.settings.host + ':' + api.settings.port)

    api.socket.on('connect', function(){
      api.emit('connect', 'connect')
    });

    api.socket.on('connect_error', function(data){
      api.emit('connect_error', data)
    });

    api.socket.on('connect_timeout', function(data){
      api.emit('connect_timeout', data)
    });

    api.socket.on('error', function(data){
      api.emit('error', data)
    });

    api.socket.on('log', function(data){
      api.emit('log', data)
    })
  }

  api.join = function(id){
    api.socket.emit('join', id)
  }

  api.leave = function(id){
    api.socket.emit('leave', id)
  }

  api.connection = function(){

  }
}


util.inherits(client_io, EventEmitter);
module.exports = client_io
