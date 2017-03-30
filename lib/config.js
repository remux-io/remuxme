
"use strict"

const jsonfile = require('jsonfile');
const path = require('path');
const os = require('os');

var remux = {}
var processes = {}


remux.read_json = function(){

  try{
    return jsonfile.readFileSync(path.join(os.userInfo().homedir, '.remux.io','remux.json'))
  }catch(e){
    try{
      return jsonfile.readFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','remux.json'))
    }catch(e){
      return {}
    }
  }

}

remux.commit = function(obj){

  try{
    jsonfile.writeFileSync(path.join(os.userInfo().homedir, '.remux.io','remux.json'), obj, {spaces: 2})
    return null
  }catch(e){
    try{
      jsonfile.writeFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','remux.json'), obj, {spaces: 2})
      return null
    }catch(e){
      return e
    }
  }

}

remux.list = function(){
  return remux.read_json()
}

remux.set = function(var_name, var_value){

  if (var_name == null){
    return `[err]:: Variable name not proveded.`
  }else if(var_value == null){
    return `[err]:: Variable value not proveded.`
  }

  var json = remux.read_json()
  json[var_name] = var_value

  var commit_result = remux.commit(json)
  if(!commit_result){
    return `[set]:: Variable "${var_name}" set to "${var_value}".\n[hint]:: Maybe need to execute "server restart" to update service with current variables.`
  }else{
    return commit_result
  }
}

remux.get = function(var_name){
  var json = remux.read_json()
  if (json[var_name] != null){
    return json[var_name]
  }else{
    return `[err]:: Variable "${var_name}" not found.`
  }
}



processes.read_json = function(){
  try{
    return jsonfile.readFileSync(path.join(os.userInfo().homedir, '.remux.io','processes.json'))
  }catch(e){
    try{
      return jsonfile.readFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','processes.json'))
    }catch(e){
      return {}
    }
  }
}


module.exports = {
  remux,
  processes
}
