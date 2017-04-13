
"use strict"

const Table = require('cli-table2');
const Duration = require('duration')
const chalk = require('chalk');
const moment = require('moment');

const processes_table = function(procs, isHost){

  var procs = procs || []

  if (!procs.forEach){
      return procs
  }

  var head = [
    chalk.blue.bold("Id"),
    chalk.blue.bold("Name"),
    chalk.blue.bold("Status"),
    chalk.blue.bold("Restarts"),
    chalk.blue.bold("Uptime")
  ]

  if (isHost){
      head.push(chalk.blue.bold("Host"))
  }

  var table = new Table({ head: head});

  procs.forEach(function(proc){

    var id = proc.id
    var name = chalk.blue(proc.configuration.name)
    var status = proc.status.status || "offline"
    var restarts = proc.status.restarts || "0"
    var uptime = proc.status.uptime || "0"
    var host = (isHost?proc.host:null)

    //uptime
    if (status == "online"){
      uptime = new Duration(new Date(parseInt(uptime)), new Date())
      uptime = uptime.toString(1,1)
    }else{
      uptime = "0"
    }

    //status
    if (status == "online"){
      status = chalk.green(status)
    }else{
      status = chalk.red(status)
    }

    var result = [ id, name, status, restarts, uptime ]

    if (isHost){
        result.push(host)
    }

    table.push(result)
  })

  return table
}




const modules_table = function(mods){

  mods = mods || []

  if (!mods.forEach){
      return mods
  }

  var head = [
    chalk.blue.bold("Name"),
    chalk.blue.bold("Status"),
    chalk.blue.bold("Restarts"),
    chalk.blue.bold("Uptime"),
    chalk.blue.bold("PID"),
    chalk.blue.bold("CPU"),
    chalk.blue.bold("MEM")
  ]

  var table = new Table({ head: head});

  mods.forEach(function(mod){


    var name = chalk.blue(mod.name)
    var status = mod.status || "offline"
    var restarts = mod.restart_time || "0"
    var uptime = mod.uptime || "0"
    var pid = mod.pid
    var cpu = mod.cpu
    var mem = mod.memory

    //uptime
    if (status == "online"){
      uptime = new Duration(new Date(parseInt(uptime)), new Date())
      uptime = uptime.toString(1,1)
    }else{
      uptime = "0"
    }

    //status
    if (status == "online"){
      status = chalk.green(status)
    }else{
      status = chalk.red(status)
    }

    if (!isNaN(mem)){
      mem = Math.round(parseInt(mem)/(1048576))
    }

    if (!isNaN(cpu)){
      cpu = Math.round(cpu) + '%'
    }

    var result = [ name, status, restarts, uptime, pid, cpu, mem ]


    table.push(result)
  })

  return table
}


const module_table = function(data_list){
  var table = new Table();
  data_list = data_list || {}
  Object.keys(data_list).forEach(function(key){
    if (['settings'].indexOf(key) < 0){
      var tmp_var = {}
      tmp_var[key] = data_list[key]
      table.push(tmp_var)
    }
  })
  return table
}



const module_settings = function(data_list){
  var table = new Table();
  data_list = data_list || {}
  data_list.settings = data_list.settings || {}

  data_list.settings.forEach(function(obj){
    var tmp_var = {}
    tmp_var[obj.variable] = obj.value
    table.push(tmp_var)
  })

  return table
}




const hosts_table = function(hosts){

  var hosts = hosts || []

  if (!hosts.forEach){
      return hosts
  }

  var table = new Table({ head: [
    chalk.blue.bold("Id"),
    chalk.blue.bold("Name"),
    chalk.blue.bold("Host"),
    chalk.blue.bold("Status")
  ]});

  hosts.forEach(function(host, index){

    var id = index
    var name = chalk.blue(host.name) || ""
    var host = host.host || ""
    var status = "online"

    //status
    if (status == "online"){
      status = chalk.green(status)
    }else{
      status = chalk.red(status)
    }

    table.push([ id, name, host, status ])
  })

  return table
}


const env_table = function(data_list){

  data_list = data_list || {}
  var table = new Table({ head: [
    chalk.blue.bold("Variable"),
    chalk.blue.bold("Value")
  ]});

  Object.keys(data_list).forEach(function(key){
    var tmp_var = {}
    tmp_var[key] = data_list[key]
    table.push(tmp_var)
  })

  return table
}


const print = function(msg, type, source, time){
  msg = msg
  type = type || 'info' //info, err, war
  source = source || 'remux'
  time = moment(time).format('MMM Do HH:mm:ss') || moment().format('MMM Do HH:mm:ss')

  var source_color = chalk.blue
  var msg_color = chalk.green
  var row_color = chalk.gray

  switch (type) {
    case 'log':
      msg_color = chalk.blue.bold
      source_color = chalk.blue
      break;
    case 'sucsses':
      msg_color = chalk.green
      break;
    case 'info':
      msg_color = chalk.gray
      // source_color = chalk.gray
      break;
    case 'err':
      msg_color = chalk.red.bold
      break;
    case 'war':
      msg_color = chalk.yellow
      break;
  }

  var result = row_color('[@]['+  time + '][')+
  source_color(source)+row_color('] ')+
  msg_color(msg)

  return result
}


module.exports = {
  processes_table,
  hosts_table,
  env_table,
  chalk,
  print,
  modules_table,
  module_table,
  module_settings
}
