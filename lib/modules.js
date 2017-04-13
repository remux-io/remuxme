
"use strict"

const fs = require('fs');
const config = require('./config');
const path = require('path');
const os = require('os');
const async = require('async');
const mod_pm2 = require('./module-pm2');


const remuxModules = function(){

  var mods = this;
  var modules = {}

  config.modules.read_json().forEach(function(mod){
    if (mod.settings.enabled){
      try{
        modules[mod.name] = new (mod.settings.path?require(mod.settings.path):require(mod.name))(mod.settings ,config.modules)
        mod_pm2(modules[mod.name])
      }catch(e){
        
      }
    }
  })


  mods.loadEnabledModules = function(){
    Object.keys(modules).forEach(function(moduleName){
      modules[moduleName].status(function(err, app){
        if (app){
          if (app.pid === 0){
            modules[moduleName].load(function(err){
              if(err) console.error(err);
            })
          }
        }else{
          modules[moduleName].load(function(err){
            if(err) console.error(err);
          })
        }
      })
    })
  }


  mods.list = function(callback){
    async.map(Object.keys(modules), function(moduleName, cb){
      modules[moduleName].toJson(function(res){
        if (cb) cb(null, res)
      })
    }, function(err, res){
      if (err) throw err
      callback(res)
    })

  }

  mods.getByName = function(moduleName){
    return modules[moduleName]
  }

}


module.exports = {
  remuxModules
}
