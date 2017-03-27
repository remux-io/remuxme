
"use strict"

/**

{
  "configuration":{
    "name":"",
    "program":"",
    "args":[],
    "cpus":""
  },
  "status":{
    "name":"",
    "pid":"",
    "id":"",
    "cpu":"",
    "mem":"",
    "status":"",
    "uptime":"",
    "restarts":""
  }
}

*/

const pm2 = require('pm2');
const jsonfile = require('jsonfile');
const path = require('path');

const remuxme_api = function(args){

  var api = this;
  api.args = args || {}
  api.args.host = api.args.host || '127.0.0.1'
  api.args.processes_file = api.args.processes_file || path.join(process.env.PWD, '/config/processes.json')




  api.list = function(args, callback){

    var config_json = jsonfile.readFileSync(api.args.processes_file)
    console.log(config_json);
    var processes = []

    config_json.processes.forEach(function(proc){
      var tmp_process = {
        "configuration": proc,
        "status": {
          "name":"",
          "pid":"",
          "id":"",
          "cpu":"",
          "mem":"",
          "status":"",
          "uptime":"",
          "restarts":""
        }
      }
      processes.push(tmp_process)
    })

    callback(null, processes)

  }


  api.start = function(){

  }


  api.stop = function(){

  }


  api.restart = function(){

  }


  api.info = function(){

  }


  api.config = function(){

  }

}



module.exports = remuxme_api
