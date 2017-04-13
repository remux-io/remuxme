
const pm2 = require('pm2');
const config = require('./config');

const module_prefix = 'remux_module_'


/**
 * name
 * version
 * path
 * bin
 * get (variable_name)
 * set (variable_name, value)
 * getConfigPath()
 * load(callback(err))
 * unload(callback(err))
 * status(callback(err, pm2_app))
 * toJson(callback(err, json))
 */

function getRemuxModulePm2(name, callback){
  pm2.connect(function(err){
    if (err) {
      console.error(err);
      process.exit(2);
    }

    pm2.list(function(err, pm2_apps){
      var app = pm2_apps.find(function(item){if(item.name === module_prefix+name) return true})
      callback(err, app)
    })
  })
}




module.exports = function (remuxModule){

  remuxModule.getConfigPath = function(){
    return config.modules.getConfigPath()
  }


  remuxModule.load = function(callback){
    pm2.connect(function(err){
      if (err) {
        console.error(err);
        return callback(err)
      }

      pm2.start({
        name      : module_prefix + remuxModule.name,
        script    : remuxModule.bin,
        exec_mode : 'fork',
        instances : 1,
        args      : ['-file', remuxModule.getConfigPath()],
        pm_exec_path : remuxModule.path
      }, function(err, apps) {
        if (err) throw err
        var app = apps.find(function(item){return (item.name === module_prefix + remuxModule.name)})
        remuxModule.pm2_app = app
        callback(err)
      });

    })
  }

  remuxModule.unload = function(callback){
    remuxModule.status(function(err, app){
      if (!isNaN(app.pm_id)){
        pm2.connect(function(err){
          if (err) throw err

          pm2.stop(app.pm_id,function(err){
            if (err) throw err
            if (callback) callback(err)
          })
        })
      }
    })
  }

  remuxModule.status = function(callback){
    getRemuxModulePm2(remuxModule.name, function(err, app){
      remuxModule.pm2_app = app
      if (callback) callback(err, app)
    })
  }

  remuxModule.toJson = function(callback){
    remuxModule.status(function(err, app){
      var res = {}
      res.name = remuxModule.name
      res.version = remuxModule.version
      res.path = remuxModule.path
      res.bin = remuxModule.bin
      res.config = config.modules.getConfigPath()
      res.settings = remuxModule.get(true)
      if (app){
        res.id = app.pm_id
        res.status = app.pm2_env.status
        res.restart_time = app.pm2_env.restart_time
        res.uptime = app.pm2_env.pm_uptime.toString()
        res.pid = app.pid
        res.cpu = app.monit.cpu
        res.memory = app.monit.memory
      } else {
        res.id = null;
        res.status = 'offline'
        res.restart_time = null
        res.uptime = null
        res.pid = null
        res.cpu = null
        res.memory = null
      }
      callback(res)
    })
  }


  remuxModule.status(function(err, app){})

}
