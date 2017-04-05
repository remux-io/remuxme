
"use strict"
const EventEmitter = require('events').EventEmitter;
const util = require('util');

const pm2 = require('pm2');
const config = require('./config.js');

const Logs = function(io){

  var log = this;

  pm2.connect(function(){
    pm2.launchBus(function(err, bus) {
      bus.on('log:*', function(type,packet) {
        var data = {
          id: packet.process.pm_id,
          name: packet.process.name,
          time: packet.at,
          data: packet.data
        }
        log.send(data.id.toString(), data);
      });
    });
  })


  log.send = function(process_id, data){
    if (!process_id){
      return 'process_id'
    }

    io.to(process_id).emit('log',data);
    return null;
  }

}



util.inherits(Logs, EventEmitter);
module.exports = Logs;
