
"use strict"

/**
{
  "id":"",
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
              script    : './lib/process.js',
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


  api.info = function(){

  }


  api.config = function(){

  }

}



module.exports = remuxme_api
