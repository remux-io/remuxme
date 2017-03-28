
"use strict"

const spawn = require('child_process').spawn
const exec = require('child_process').exec
const jsonfile = require('jsonfile');
const path = require('path');


var remux_process_index = parseInt(process.argv[2]) || 0
var config_json = jsonfile.readFileSync(path.join(process.env.PWD, '/config/processes.json'))

var process_config = config_json.processes[remux_process_index]

var command = process_config.program;
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
