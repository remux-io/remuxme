
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
var cpus_settings = process_config.cpus;

var options = { stdio: 'inherit' };


function cpus(param, pid){
  exec('/usr/bin/taskset -ac -p ' + param + ' ' + pid, function(err, stdout, stderr){})
}


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
  var msg = pmsg || '{}'

  msg.data.cmd = msg.data.cmd || 'ffmpeg'
  msg.data.args = msg.data.args || ''

  switch (msg.data.cmd) {
    case 'ffmpeg':
      ffprocess.send(msg.data.args)
      break;
    case 'taskset':
      cpus(msg.data.args, ffprocess.pid)
      process.send({
        type : 'process:msg',
        data : {
         success : true
        }
     });
     break;
    default:

  }
})

cpus(cpus_settings, ffprocess.pid)
