
"use strict"

const jsonfile = require('jsonfile');
const path = require('path');

var remux = {}
var processes = {}


remux.read_json = function(){
  var remux_json_filepath = path.join(path.parse(process.mainModule.filename).dir, '..', 'config','remux.json')
  try{
    return jsonfile.readFileSync(remux_json_filepath)
  }catch(e){
    return {}
  }
}

remux.commit = function(obj){
  var remux_json_filepath = path.join(path.parse(process.mainModule.filename).dir, '..', 'config','remux.json')
  try{
    jsonfile.writeFileSync(remux_json_filepath, obj, {spaces: 2})
    return null
  }catch(e){
    return e
  }
}

remux.list = function(){
  return remux.read_json()
}

remux.set = function(var_name, var_value){
  var json = remux.read_json()
  json[var_name] = var_value

  var commit_result = remux.commit(json)
  if(!commit_result){
    return `[set]:: Variable "${var_name}" set to "${var_value}".\n[hint]:: Maybe need to execute "server start" to update service with current variables.`
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
  var processes_json_filepath = path.join(path.parse(process.mainModule.filename).dir, '..', 'config','settings.json')
  try{
    return jsonfile.readFileSync(processes_json_filepath).processes
  }catch(e){
    return []
  }
}


module.exports = {
  remux,
  processes
}
