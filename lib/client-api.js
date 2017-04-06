
"use strict"

const request = require('request');
const path = require('path');

const ql_cmds = require('./ql-cmds');
const config = require('./config.js');

function ql_request(uri, data, user, pass, callback){
  request({
    method: 'POST',
    auth: {
      'user': user,
      'pass': pass
    },
    preambleCRLF: true,
    postambleCRLF: true,
    uri: uri,
    json: data,
    timeout: 4000
  },
  function (error, response, body) {
    callback(error, body)
  })
}



const client_api = function(args){

  var api = this
  var config_json = config.remux.read_json()

  config_json = config_json || {}

  api.settings = args || {}
  api.settings.protocol = api.settings.protocol || 'http'
  api.settings.host = api.settings.host || config_json.host || '127.0.0.1'
  api.settings.port = api.settings.port || config_json.port || '4000'
  api.settings.user = api.settings.user || config_json.admin || 'remux'
  api.settings.pass = api.settings.pass || config_json.pass || 'remuxme'

  api.exec = function(pcmd, vars, callback){

    var cmd = pcmd || 'list'
    if (ql_cmds[cmd]){
      var query = ql_cmds[cmd]
      if (query.variables){
        Object.keys(query.variables).forEach(function(key){
          if (vars[key] != null){
            query.variables[key] = vars[key]
          }
        })
      }

      ql_request(api.settings.protocol+'://'+api.settings.host+':'+api.settings.port, query,api.settings.user,api.settings.pass, function(err, result){
        var res = result
        if(!err){
          if (query.data){
            if (query.data.serialize) res = query.data.serialize(res)
          }
        }
        return callback(err, res)
      })
    }else{
      callback("command not found", null)
    }
  }

}


module.exports = client_api
