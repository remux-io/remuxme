

"use strict"

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require('graphql');

const remuxme_pm2_api = require('./remuxme-pm2')
const config = require('./config')
const server_api = require('./server')


const setInputObject = new GraphQLInputObjectType({
  name: 'SetInput',
  description: 'Input set object.',
  fields:{
    variable:{
      type: GraphQLString,
      description: 'Variable name.'
    },
    value:{
      type: GraphQLString,
      description: 'New value for variable.'
    }
  }
})


const setObject = new GraphQLObjectType({
  name: 'Set',
  description: 'Set object',
  fields:{
    variable:{
      type: GraphQLString,
      description: 'Variable name.'
    },
    value:{
      type: GraphQLString,
      description: 'Value for variable.'
    }
  }
})



const processConfigObject = new GraphQLObjectType({
  name: 'ProcessConfig',
  description: 'Remux Process',
  fields: {
    name: {
      type: GraphQLString,
      description: 'Remux Process Name'
    },
    program: {
      type: GraphQLString,
      description: 'Remux Process Program'
    },
    args: {
      type: new GraphQLList(GraphQLString),
      description: 'Remux Process Ffmpeg args'
    },
    cpus: {
      type: GraphQLString,
      description: 'Remux Process CPU affinity'
    }
  }
});


const processInfoObject = new GraphQLObjectType({
  name: 'ProcessInfo',
  description: 'Remux Process Information',
  fields: {
    name: {
      type: GraphQLString,
      description: 'pm2 name'
    },
    pid: {
      type: GraphQLString,
      description: 'system PID'
    },
    id: {
      type: GraphQLString,
      description: 'pm2 id'
    },
    cpu: {
      type: GraphQLString,
      description: 'cpu used in current moment'
    },
    mem: {
      type: GraphQLString,
      description: 'memory used in current moment'
    },
    status:{
      type: GraphQLString,
      description: 'process status'
    },
    uptime: {
      type: GraphQLString,
      description: 'process uptime'
    },
    restarts: {
      type: GraphQLString,
      description: 'process restarts'
    }
  }
});


const processObject = new GraphQLObjectType({
  name: 'Process',
  description: 'Remux Process',
  fields: {
    id: { type: GraphQLInt },
    configuration: { type: processConfigObject },
    status: { type: processInfoObject }
  }
})



const serverObject = new GraphQLObjectType({
  name: 'Server',
  description:'Server management.',
  fields:{
    stop:{
      type: GraphQLString,
      description: 'Stop Remux server.',
      resolve(value, args){
        var server = new server_api()
        server.stop(function(err, msg){})
        return "Stoping..."
      }
    },
    restart:{
      type: GraphQLString,
      description: 'Restart Remux server.',
      resolve(value, args){
        var server = new server_api()
        server.start(function(err, msg){})
        return "Restarting..."
      }
    },
    listSets:{
      type: new GraphQLList(setObject),
      description: 'Return list of sets and values.',
      resolve(value, args) {
        var sets = config.remux.read_json()
        var result = []
        Object.keys(sets).forEach(function(key){
          result.push({ variable:key, value: sets[key] })
        })
        return result
      }
    },
    set:{
      type: GraphQLString,
      description: 'Set variable value.',
      args: {
        param:{ type: setInputObject}
      },
      resolve(value, args) {
        return config.remux.set(args.param.variable, args.param.value)
      }
    },
    get:{
      type: GraphQLString,
      description: 'Get variable value.',
      args: {
        variable:{ type: GraphQLString}
      },
      resolve(value, args) {
        return config.remux.get(args.variable)
      }
    }
  }
})



const processorObject = new GraphQLObjectType({
  name: 'Processor',
  description: 'Remux Processor',
  fields:{
    list:{
      type: new GraphQLList(processObject),
      description: 'list remux processes',
      resolve(value, args) {

        return new Promise(function(resolve){
          var api = new remuxme_pm2_api();
          api.list({},function(err, result){
            return resolve(result)
          })
        })

      }
    },
    start:{
      type: new GraphQLList(processObject),
      description: 'start remux process',
      args: {
        id:{ type: GraphQLInt}
      },
      resolve(value, args) {

        if (isNaN(args.id)) return null

        return new Promise(function(resolve){
          var api = new remuxme_pm2_api();
          api.start(args.id,function(err, result){
            return resolve(result)
          })
        })

      }
    },
    stop:{
      type: new GraphQLList(processObject),
      description: 'stop remux process',
      args: {
        id:{ type: GraphQLInt}
      },
      resolve(value, args) {

        if (isNaN(args.id)) return null

        return new Promise(function(resolve){
          var api = new remuxme_pm2_api();
          api.stop(args.id,function(err, result){
            return resolve(result)
          })
        })

      }
    },
    restart:{
      type: processObject,
      description: 'restart remux process',
      args: {
        id:{ type: GraphQLInt}
      },
      resolve(value, args) {
        return JSON.stringify(args);
      }
    },
    info:{
      type: processObject,
      description: 'start remux process',
      args: {
        id:{ type: GraphQLInt}
      },
      resolve(value, args) {
        return JSON.stringify(args);
      }
    }
  }
})


const Remux = new GraphQLObjectType({
  name: 'Remux',
  description:'',
  fields:{
    server:{
      type: serverObject,
      resolve(){
        return serverObject
      }
    },
    processor:{
      type: processorObject,
      resolve(){
        return processorObject
      }
    }
  }
})

const RemuxProcessorSchema = new GraphQLSchema({
    query: Remux
})


module.exports = RemuxProcessorSchema;
