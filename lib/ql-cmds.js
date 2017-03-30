
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
        return res_data.data.server.restart;
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

module.exports = ql_cmds
