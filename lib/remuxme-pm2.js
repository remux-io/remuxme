
"use strict"

/**
{
  "id":"",
  "configuration":{
    "name":"",
    "description":"",
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

const config = require('./config.js');



const remuxme_api = function(args){

  var api = this;
  api.args = args || {}

  api.list = function(args, callback){
    var config_json = config.processes.read_json()
    var processes = []

    pm2.connect(function(err){
      if (err) {
        console.error(err);
        process.exit(2);
      }

      pm2.list(function(err, pm2_apps){

        config_json.processes.forEach(function( proc, index ){
          var tmp_process = {
            "id":index,
            "configuration": proc,
            "status": {
              "name":null,
              "pid":null,
              "id":null,
              "cpu":null,
              "mem":null,
              "status":null,
              "uptime":null,
              "restarts":null
            }
          }

          var app = pm2_apps.find(function(item){if(item.name=='remux_ffmpeg_'+proc.name) return true})

          if (app){
            tmp_process.status = {
              "name":app.name,
              "pid":app.pid,
              "id":app.pm_id,
              "cpu":app.monit.cpu,
              "mem":app.monit.memory,
              "status":app.pm2_env.status,
              "uptime":app.pm2_env.pm_uptime,
              "restarts":app.pm2_env.restart_time
            }
          }

          processes.push(tmp_process);
        })
        pm2.disconnect();
        callback(null, processes)
      })

    })

  }



  api.start = function(id, callback){
    api.list({},function(err, processes){
      try{
        if (processes[id]){
          pm2.connect(function(err){
            if (err) {
              console.error(err);
              process.exit(2);
            }

            pm2.start({
              name      : 'remux_ffmpeg_'+processes[id].configuration.name,
              script    : path.join(path.parse(process.mainModule.filename).dir, '..', 'lib','process.js'),
              exec_mode : 'fork',
              instances : 1,
              args      : id.toString()
            }, function(err, apps) {
              pm2.disconnect();
              if (err) throw err
              api.list({},function(err, processes){
                callback(err, processes)
              })
            });
          })
        }else{
          return callback(true, null)
        }
      }catch(e){
        return callback(e, null)
      }
    })
  }


  api.stop = function(id, callback){
    api.list({},function(err, processes){
      try{
        var proc = processes.find(function(item){if(item.id==id) return true})
        var pm2_id = proc.status.id
        if (pm2_id){
          pm2.connect(function(err){
            if (err) {
              console.error(err);
              process.exit(2);
            }
            pm2.stop(pm2_id,function(err){
              pm2.disconnect();
              if (err) throw err
              api.list({},function(err, processes){
                callback(err, processes)
              })
            })
          })
        }
      }catch(e){
        callback(e, null)
      }

    })
  }


  api.info = function(id, callback){
    var config_json = config.processes.read_json().processes

    if(isNaN(id)){
      callback(true, null)
    } else if (config_json[id]){
      var proc = config_json[id]
    }else{
      callback(true, null)
    }

    var tmp_process = {
      "id":id,
      "description": proc.description,
      "name": proc.name,
      "cpus": proc.cpus,
      "program": proc.program
    }

    pm2.connect(function(err){
      if (err) {
        callback(err, tmp_process)
      }

      pm2.list(function(err, pm2_apps){
        var app = pm2_apps.find(function(item){if(item.name=='remux_ffmpeg_'+proc.name) return true})

        if (app){
          tmp_process['pid'] = app.pid
          tmp_process['pm_id'] = app.pm_id
          tmp_process['cpu'] = app.monit.cpu
          tmp_process['mem'] = app.monit.memory
          tmp_process['status'] = app.pm2_env.status
          tmp_process['uptime'] = app.pm2_env.pm_uptime
          tmp_process['restarts'] = app.pm2_env.restart_time
        }

        pm2.disconnect();
        callback(null, tmp_process)
      })
    })
  }


  api.config = function(){

  }

}



module.exports = remuxme_api
