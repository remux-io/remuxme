
"use strict"

const ql_cmds = {}

ql_cmds.list = {
  query: "query { processor { list { id configuration { name program args cpus } status {name pid id cpu mem status uptime restarts } } } }",
  variables: null,
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.processor.list;
      }catch(e){
        return [];
      }
    },
    type: 'list'
  }
}

ql_cmds.start = {
  query: `query ( $id: Int ) { processor { start ( id: $id ) { id configuration { name program args cpus } status { name pid id cpu mem status uptime restarts } } } }`,
  variables:{
    id:null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.processor.start;
      }catch(e){
        return e.toString();
      }
    },
    type: 'msg'
  }
}

ql_cmds.stop = {
  query: `query ( $id: Int ) { processor { stop ( id: $id ) { id configuration { name program args cpus } status { name pid id cpu mem status uptime restarts } } } }`,
  variables:{
    id:null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.processor.stop;
      }catch(e){
        return e.toString();
      }
    },
    type: 'msg'
  }
}




ql_cmds.info = {
  query: `query ( $id: Int ) { processor { info (id:$id) { id description name cpus program pid pm_id cpu mem status uptime restarts } } }`,
  variables:{
    id:null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.processor.info;
      }catch(e){
        return e.toString();
      }
    },
    type: 'list'
  }
}


ql_cmds.process_get = {
  query: `query ($id:Int, $variable:String) { processor { get (id:$id, variable:$variable) } }`,
  variables:{
    id: null,
    variable: null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.processor.get;
      }catch(e){
        return e.toString();
      }
    },
    type: 'msg'
  }
}


ql_cmds.process_set = {
  query: `query ($id:Int, $variable:String, $value:String) { processor { set (id:$id, param:{variable:$variable, value:$value} ) } }`,
  variables:{
    id: null,
    variable:null,
    value:null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.processor.set;
      }catch(e){
        return e.toString();
      }
    },
    type: 'msg'
  }
}


ql_cmds.server_restart = {
  query: `query { server { restart } }`,
  variables:null,
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.server.restart;
      }catch(e){
        return e.toString();
      }
    },
    type: 'msg'
  }
}


ql_cmds.server_stop = {
  query: `query { server { stop } }`,
  variables:null,
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.server.stop;
      }catch(e){
        return e.toString();
      }
    },
    type: 'msg'
  }
}


ql_cmds.server_listSets = {
  query: `query { server { listSets { variable value } } }`,
  variables:null,
  data:{
    serialize: function(res_data){
      var data
      var result = {}
      try{
         data = res_data.data.server.listSets
         data.forEach(function(item){
           result[item.variable] = item.value
         })
         return result
      }catch(e){
        return {}
      }
    },
    type: 'object'
  }
}


ql_cmds.server_set = {
  query: `query ( $variable:String, $value:String ) { server { set (param: { variable:$variable, value:$value } ) } }`,
  variables:{
    variable:null,
    value:null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.server.set;
      }catch(e){
        return e.toString();
      }
    },
    type: 'msg'
  }
}

ql_cmds.server_get = {
  query: `query ( $variable:String ) { server { get ( variable:$variable ) } }`,
  variables:{
    variable:null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.server.get;
      }catch(e){
        return e.toString();
      }
    },
    type: 'msg'
  }
}


ql_cmds.cpus = {
  query: `query ($id:Int, $cpus:String) { processor { cpus (id:$id,cpus:$cpus) } }`,
  variables:{
    id:null,
    cpus:null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.processor.cpus;
      }catch(e){
        return e.toString();
      }
    },
    type: 'msg'
  }
}


ql_cmds.modules_list = {
  query: `query{ modules { list { name version path bin config id status restart_time uptime pid cpu memory settings { variable value } } } }`,
  variables:null,
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.modules.list;
      }catch(e){
        return e.toString();
      }
    },
    type: 'list'
  }
}


ql_cmds.modules_status = {
  query: `query($name:String){ modules { status ( name:$name ) { name version path bin config id status restart_time uptime pid cpu memory settings { variable value } } } }`,
  variables:{
    name:null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.modules.status;
      }catch(e){
        return e.toString();
      }
    },
    type: 'object'
  }
}


ql_cmds.modules_load = {
  query: `query($name:String){ modules { load ( name:$name ) { name version path bin config id status restart_time uptime pid cpu memory settings { variable value } } } }`,
  variables:{
    name:null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.modules.load;
      }catch(e){
        return e.toString();
      }
    },
    type: 'object'
  }
}


ql_cmds.modules_unload = {
  query: `query($name:String){ modules { unload ( name:$name ) { name version path bin config id status restart_time uptime pid cpu memory settings { variable value } } } }`,
  variables:{
    name:null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.modules.unload;
      }catch(e){
        return e.toString();
      }
    },
    type: 'object'
  }
}


ql_cmds.modules_set = {
  query: `query($name:String, $variable:String, $value:String) { modules { set(name:$name, variable:$variable, value:$value){ name version path bin config id status restart_time uptime pid cpu memory settings { variable value } } } }`,
  variables:{
    name:null,
    variable:null,
    value:null
  },
  data:{
    serialize: function(res_data){
      try {
        return res_data.data.modules.set;
      }catch(e){
        return e.toString();
      }
    },
    type: 'object'
  }
}

module.exports = ql_cmds
