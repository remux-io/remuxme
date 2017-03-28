
"use strict"

const ql_cmds = require('./ql-cmds');
const request = require('request');


function ql_request(uri, data, callback){
  request({
    method: 'POST',
    preambleCRLF: true,
    postambleCRLF: true,
    uri: uri,
    json: data
  },
  function (error, response, body) {
    callback(error, body)
  })
}



const client_api = function(args){

  var api = this
  api.settings = args || {}
  api.settings.protocol = api.settings.protocol || 'http'
  api.settings.host = api.settings.host || '127.0.0.1'
  api.settings.port = api.settings.port || '4000'


  api.exec = function(pcmd, vars, callback){

    var cmd = pcmd || 'list'
    if (ql_cmds[cmd]){
      var query = ql_cmds[cmd]
      if (query.variables){
        Object.keys(query.vars).forEach(function(key){
          if (vars[key]){
            query.variables[key] = vars[key]
          }
        })
      }
console.log(query);
      ql_request(api.settings.protocol+'://'+api.settings.host+':'+api.settings.port, query, function(err, result){
        callback(err, result)
      })
    }else{
      callback("command not found", null)
    }
  }


}


module.exports = client_api
