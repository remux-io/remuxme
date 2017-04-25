
"use strict"

const spawn = require('child_process').spawn
const exec = require('child_process').exec
const jsonfile = require('jsonfile');
const path = require('path');

const config = require('./config.js');

const remux_var_regex = new RegExp(/\$\{remux\:\{(.+?)\}\}/, 'g')

function cpus(param, pid){
  exec('/usr/bin/taskset -ac -p ' + param + ' ' + pid, function(err, stdout, stderr){})
}

var remux_process_index = parseInt(process.argv[2]) || 0
var config_json = config.processes.read_json()
var remux_config_json = config.remux.read_json()
var process_config = config_json.processes[remux_process_index]
var command = process_config.program || remux_config_json.ffmpegDefaultPath;
var cpus_settings = process_config.cpus;
var settings = process_config.settings || {};

var options = { stdio: 'inherit' };

var args = [];


if (process_config.template){
  var template = config.templates.list().find(function(item){
    return (item.name === process_config.template)
  })

  if (template){
    command = template.program || command

    template.args.forEach(function(arg){
      var new_arg = arg
      var result = arg.match(remux_var_regex);
      // var result = remux_var_regex.exec(arg)
      if (result){
        result.forEach(function(v){
          new_arg = new_arg.replace(v, settings[v])
        })
      }
      args.push(new_arg)
    })

  }else{
    args = process_config.args;
  }
}else{
  args = process_config.args;
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
