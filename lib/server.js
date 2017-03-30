"use strict"

const pm2 = require('pm2');
const path = require('path');


const remux = function(args){

  var api = this;
  api.setings = args || {}

  api.start = function(callback){
    pm2.connect(function(err){
      if (err) {
        console.error(err);
        process.exit(2);
      }

      pm2.start({
        name      : 'remux_server',
        script    : path.join(path.parse(process.mainModule.filename).dir, '..', 'lib','express.js'),
        exec_mode : 'fork',
        instances : 1
      }, function(err, apps) {
        pm2.disconnect();
        callback(err, 'Remux server start')
      });
    })
  }


  api.stop = function(callback){
    pm2.connect(function(err){
      if (err) {
        console.error(err);
        process.exit(2);
      }
      pm2.stop('remux_server',function(err){
        pm2.disconnect();
        callback(err, 'Remux server stop')
      })
    })
  }


  api.restart = function(){

  }

}


module.exports = remux
