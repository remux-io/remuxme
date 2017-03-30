
"use strict"

const spawn = require('child_process').spawn
const exec = require('child_process').exec
const jsonfile = require('jsonfile');
const path = require('path');

const config = require('./config.js');


var remux_process_index = parseInt(process.argv[2]) || 0
var config_json = config.processes.read_json()
var remux_config_json = config.remux.read_json()


var process_config = config_json.processes[remux_process_index]

var command = process_config.program || remux_config_json.ffmpegDefaultPath;
var args = process_config.args;

var options = { stdio: 'inherit' };

var ffprocess = spawn(command, args, options)


ffprocess.on('close', function(code){
  process.exitCode = code
  process.exit(code)
})


ffprocess.on('exit', function(code){
  process.exitCode = code
  process.exit(code)
})


process.on('message', function(pmsg){

  var msg = pmsg || {}
  msg.cmd = msg.cmd || 'ffmpeg'
  msg.args = msg.args || ''

  switch (msg.type) {
    case 'ffmpeg':
      ffprocess.send(msg.args)
      break;
    case 'taskset':
      exec('taskset -ac -p ' + msg.args + ' ' + ffprocess.pid)
      break;
    default:

  }

})
