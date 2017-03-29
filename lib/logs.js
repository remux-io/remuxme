
"use strict"

const EventEmitter = require('events').EventEmitter;
const util = require('util');


const Logs = function(){

  var log = this;
  log.processes = {}

  log.add = function(args){
    var set = args || {}
    set.id = args.id || Object.keys(log.processes).length
    set.filepath = args.filepath || null

    log.processes[set.id] = {
      filepath : set.filepath
    }
  }

  log.update = function(id, msg){

  }

  log.start = function(id){

  }

}



util.inherits(Logs, EventEmitter);
module.exports = Logs;
