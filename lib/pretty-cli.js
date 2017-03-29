
"use strict"

const Table = require('cli-table2');
const Duration = require('duration')
const chalk = require('chalk');

const processes_table = function(procs){

  var procs = procs || []


  var table = new Table({ head: [
    chalk.blue.bold("Id"),
    chalk.blue.bold("Name"),
    chalk.blue.bold("Status"),
    chalk.blue.bold("Restarts"),
    chalk.blue.bold("Uptime")
  ]});

  procs.forEach(function(proc){

    var id = proc.id
    var name = chalk.blue(proc.configuration.name)
    var status = proc.status.status || "offline"
    var restarts = proc.status.restarts || "0"
    var uptime = proc.status.uptime || "0"


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




    table.push([ id, name, status, restarts, uptime ])
  })

  return table
}






module.exports = {
  processes_table
}
