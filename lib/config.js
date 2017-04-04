
"use strict"

const jsonfile = require('jsonfile');
const path = require('path');
const os = require('os');

var remux = {}
var processes = {}
var hosts = {}
var templates = {}

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

    var new_host = args || {}
    new_host.name = new_host.name || 'undefined_' + new Date().getTime().toString().substr(9,4)
    new_host.ssl = new_host.ssl || false
    new_host.host = new_host.host || "127.0.0.1"
    new_host.port = new_host.port || 4000
    new_host.user = new_host.user || "remux"
    new_host.pass = new_host.pass || "remuxme"

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
    return {}
  }else if(!name){
    return `[err]:: Template name is not proveded.`
  }

  var json = json.find(function(item){return !(item.name === name)})

  templates.commit(json)
  return json
}


templates.add = function(args){
    var json = templates.read_json()

    var new_template = args || {}
    new_template.name = new_template.name || 'undefined_' + new Date().getTime().toString().substr(9,4)
    new_template.program = new_template.program || null
    new_template.args = new_template.args

    json.push(new_template)
    templates.commit(json)
}



module.exports = {
  remux,
  processes,
  hosts,
  templates
}
