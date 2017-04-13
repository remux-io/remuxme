
"use strict"

const jsonfile = require('jsonfile');
const path = require('path');
const os = require('os');
const fs = require('fs');


var remux = {}
var processes = {}
var hosts = {}
var templates = {}
var settings = {}
var modules = {}





/**
 * Remux server
 */

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
    return `[err]:: Variable name is not proveded.`
  }else if(var_value == null){
    return `[err]:: Variable value is not proveded.`
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



/**
 * Processes
 */
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


processes.commit = function(obj){
  try{
    jsonfile.writeFileSync(path.join(os.userInfo().homedir, '.remux.io','processes.json'), obj, {spaces: 2})
    return null
  }catch(e){
    try{
      jsonfile.writeFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','processes.json'), obj, {spaces: 2})
      return null
    }catch(e){
      return e
    }
  }
}

processes.get = function(id, variable){
  if (isNaN(id)){
    return `[err]:: Id of process is not proveded.`
  }else if(variable == null){
    return `[err]:: Variable name is not proveded.`
  }
  var procs = processes.read_json().processes
  var proc = procs[id]
  return proc[variable]
}

processes.set = function(id, variable, value){
  if(isNaN(id)){
    return `[err]:: Id of process is not proveded.`
  }else if (variable == null){
    return `[err]:: Variable name is not proveded.`
  }else if(value == null){
    return `[err]:: Variable value is not proveded.`
  }

  var procs = processes.read_json()
  if (procs.processes[id]){
    procs.processes[id][variable] = value

    var commit_result = processes.commit(procs)
    if(!commit_result){
      return `[set]:: Variable "${variable}" set to "${value}" of ffmpeg process "${id}".\n[hint]:: Maybe need to execute "restart <id>" to update service with current variables.`
    }else{
      return commit_result
    }
  }else{
    return `[err]:: Cannot find process `
  }

}


/**
 * Hosts
 */

hosts.read_json = function(){
    try{
      return jsonfile.readFileSync(path.join(os.userInfo().homedir, '.remux.io','hosts.json'))
    }catch(e){
      try{
        return jsonfile.readFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','hosts.json'))
      }catch(e){
        return {}
      }
    }
}


hosts.commit = function(obj){
    try{
      jsonfile.writeFileSync(path.join(os.userInfo().homedir, '.remux.io','hosts.json'), obj, {spaces: 2})
      return null
    }catch(e){
      try{
        jsonfile.writeFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','hosts.json'), obj, {spaces: 2})
        return null
      }catch(e){
        return e
      }
    }
}


hosts.list = function(){
    return hosts.read_json()
}


hosts.info = function(id){
    var json = hosts.read_json()
    if (isNaN(id)){
        return `[err]:: Host id is not proveded.`
    }else if (!json[id]){
        return `[err]:: Cannot found host with id "${id}".`
    }else{
        return json[id]
    }
}


hosts.remove = function(id){
    var json = hosts.read_json()
    if (isNaN(id)){
        return `[err]:: Host id is not proveded.`
    }else if (!json[id]){
        return `[err]:: Cannot found host with id "${id}".`
    }else{
        json = json.filter(function(item, index){
            return !(index === id)
        })
        hosts.commit(json)
        return json
    }
}


hosts.set = function(id, variable, value){
    if(isNaN(id)){
      return `[err]:: Id of host is not proveded.`
    }else if (variable == null){
      return `[err]:: Variable name is not proveded.`
    }else if(value == null){
      return `[err]:: Variable value is not proveded.`
    }

    var json = hosts.read_json()
    if (json[id]){
      json[id][variable] = value

      var commit_result = hosts.commit(json)
      if(!commit_result){
        return `[set]:: Variable "${variable}" set to "${value}" of host "${id}".`
      }else{
        return commit_result
      }
    }else{
      return `[err]:: Cannot find host with id "${id}" `
    }
}


hosts.add = function(args){
    var json = hosts.read_json()

    args = args || {}
    var new_host = {}
    new_host.name = args.name || 'undefined_' + new Date().getTime().toString().substr(9,4)
    new_host.ssl = args.ssl || false
    new_host.host = args.host || "127.0.0.1"
    new_host.port = args.port || 4000
    new_host.user = args.user || "remux"
    new_host.pass = args.pass || "remuxme"

    json.push(new_host)
    hosts.commit(json)
}


/**
 * Templates
 */

templates.read_json = function(){
  try{
    return jsonfile.readFileSync(path.join(os.userInfo().homedir, '.remux.io','templates.json'))
  }catch(e){
    try{
      return jsonfile.readFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','templates.json'))
    }catch(e){
      return {}
    }
  }
}

templates.commit = function(obj){
  try{
    jsonfile.writeFileSync(path.join(os.userInfo().homedir, '.remux.io','templates.json'), obj, {spaces: 2})
    return null
  }catch(e){
    try{
      jsonfile.writeFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','templates.json'), obj, {spaces: 2})
      return null
    }catch(e){
      return e
    }
  }
}

templates.list = function(){
  return templates.read_json()
}

templates.info = function(name){
  var json = templates.read_json()

  if (!json.forEach){
    return {}
  }else if(!name){
    return `[err]:: Template name is not proveded.`
  }

  var template = json.find(function(item){return (item.name === name) })

  if (template){
    return template
  }else{
    return `[err]:: Cannot found template with name "${name}".`
  }
}

templates.set = function(name, variable, value){
  var json = templates.read_json()

  if (!json.forEach){
    return `[info]:: No templates definded.`
  }else if(!name){
    return `[err]:: Template name is not proveded.`
  }else if(!variable){
    return `[err]:: Variable name is not proveded.`
  }else if(!value){
    return `[err]:: Variable value is not proveded.`
  }

  var index = json.findIndex(function(item){return (item.name === name)})

  if (index < 0){
    return `[err]:: Cannot found template with name "${name}".`
  }else{
    json[index][variable] = value;
    var commit_result = templates.commit(json)
    if(!commit_result){
      return null//`[set]:: Variable "${variable}" set to "${value}" of template "${name}".`
    }else{
      return commit_result
    }
  }
}

templates.get = function(name, variable){
  var json = templates.read_json()

  if (!json.forEach){
    return `[info]:: No templates definded.`
  }else if(!name){
    return `[err]:: Template name is not proveded.`
  }else if(!variable){
    return `[err]:: Variable name is not proveded.`
  }

  var index = json.findIndex(function(item){return (item.name === name)})

  if (json[index]){
    return json[index][variable]
  }else{
    return `[err]:: Cannot found template with name "${name}".`
  }
}


templates.remove = function(name){
  var json = templates.read_json()

  if (!json.forEach){
    return []
  }else if(!name){
    return `[err]:: Template name is not proveded.`
  }

  var json = json.filter(function(item){return !(item.name === name)})

  templates.commit(json)
  return json
}


templates.add = function(args){
    var json = templates.read_json()

    args = args || {}

    var new_template = {}
    new_template.name = args.name || 'undefined_' + new Date().getTime().toString().substr(9,4)
    new_template.program = args.program || null
    new_template.args = args.args

    try{
      if (!new_template.args.forEach){
        new_template.args = JSON.parse(new_template.args)
      }
    }catch(e){
      new_template.args = []
    }

    json.push(new_template)
    templates.commit(json)
}






/**
 * Modules
 */

modules.read_json = function(){
  try{
    return jsonfile.readFileSync(path.join(os.userInfo().homedir, '.remux.io','modules.json'))
  }catch(e){
    try{
      return jsonfile.readFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','modules.json'))
    }catch(e){
      return {}
    }
  }
}

modules.commit = function(obj){
  try{
    jsonfile.writeFileSync(path.join(os.userInfo().homedir, '.remux.io','modules.json'), obj, {spaces: 2})
    return null
  }catch(e){
    try{
      jsonfile.writeFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','modules.json'), obj, {spaces: 2})
      return null
    }catch(e){
      return e
    }
  }
}

modules.getConfigPath = function(){
  try{
    jsonfile.readFileSync(path.join(os.userInfo().homedir, '.remux.io','modules.json'))
    return path.join(os.userInfo().homedir, '.remux.io','modules.json')
  }catch(e){
    try{
      jsonfile.readFileSync(path.join(path.parse(process.mainModule.filename).dir, '..', 'config','modules.json'))
      return path.join(path.parse(process.mainModule.filename).dir, '..', 'config','modules.json')
    }catch(e){
      return null
    }
  }
}

modules.getByName = function(moduleName, index){
  var mods = modules.read_json()
  if (index){
    return mods.findIndex(function(item){ return (item.name === moduleName) })
  }else{
    return mods.find(function(item){ return (item.name === moduleName) })
  }
}


modules.list = function(mod, isList){

  if (typeof mod === 'boolean'){
    isList = mod
    mod = null
  }

  var result = (isList ? [] : {})

  if (mod){
    var res = modules.list(mod, isList)
    if (res){
      Object.keys(res.settings).forEach(function(key){
        if (!isList){
          result[mod.name + ':' + key] = mod.settings[key]
        }else{
          var res = {}
          res.variable = mod.name + ':' + key
          res.value = mod.settings[key]
          result.push(res)
        }
      })
    }
  }else{
    var mods = modules.read_json()
    mods.forEach(function(mod){
      Object.keys(mod.settings).forEach(function(key){
        if (!isList){
          result[mod.name + ':' + key] = mod.settings[key]
        }else{
          var res = {}
          res.variable = mod.name + ':' + key
          res.value = mod.settings[key]
          result.push(res)
        }
      })
    })
  }
  return result
}


modules.set = function(moduleName, variableName, value, isList){
  if (moduleName && variableName && value){
    // set new value
    var modIndex = modules.getByName(moduleName, true)

    if (modIndex >= 0){
      try{
        var mods = modules.read_json()
        mods[modIndex].settings[variableName] = value
        console.log(mods);
        modules.commit(mods)
        return mods[modIndex][variableName]
      }catch(e){
        return null
      }
    }else{
      return null
    }
  }else if (moduleName && variableName && !value){
    // return value of module variable
    var mod = modules.getByName(moduleName)
    try{
      return mod.settings[variableName]
    }catch(e){
      return null
    }
  }else if(moduleName && !variableName && !value){
    // list all variables and values of module
    return modules.list(modules.getByName(moduleName), isList)
  }else{
    // list all variables of all modules
    return modules.list(null, isList)
  }
}






/**
 * settings dir
 */
settings.check_settings_dir = function(cb){
    fs.access(path.join(os.userInfo().homedir, '.remux.io'), fs.constants.R_OK | fs.constants.W_OK, function(err) {
        if (cb) cb( err ? false : true )
    });
}


settings.init_settings_dir = function(cb){
    fs.mkdir(path.join(os.userInfo().homedir, '.remux.io'), function(err){
        if (!err){
            remux.commit(remux.read_json())
            processes.commit(processes.read_json())
            hosts.commit(hosts.read_json())
            templates.commit(templates.read_json())
            modules.commit(modules.read_json())
            cb(null, path.join(os.userInfo().homedir, '.remux.io'))
        }else{
            cb(true, path.join(os.userInfo().homedir, '.remux.io'))
        }

    })
}


module.exports = {
  remux,
  processes,
  hosts,
  templates,
  settings,
  modules
}
