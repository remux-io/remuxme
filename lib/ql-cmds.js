
"use strict"

const ql_cmds = {}

ql_cmds.list = {
  "query": "query { list{ id configuration { name program args cpus } status {name pid id cpu mem status uptime restarts}}}",
  "variables": null
}

ql_cmds.start = {
  query: `query($id: Int){start(id: $id){ id configuration { name program args cpus } status {name pid id cpu mem status uptime restarts}}}`,
  variables:{
    id:null
  }
}

ql_cmds.stop = {
  query: `query($id: Int){stop(id: $id){ id configuration { name program args cpus } status {name pid id cpu mem status uptime restarts}}}`,
  variables:{
    id:null
  }
}


module.exports = ql_cmds
