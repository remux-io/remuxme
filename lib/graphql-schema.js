

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
    configuration: {
      type: processConfigObject
    },
    status: {
      type: processInfoObject
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
      type: processObject,
      description: 'start remux process',
      args: {
        id:{ type: GraphQLString}
      },
      resolve(value, args) {
        return JSON.stringify(args);
      }
    },
    stop:{
      type: processObject,
      description: 'stop remux process',
      args: {
        id:{ type: GraphQLString}
      },
      resolve(value, args) {
        return JSON.stringify(args);
      }
    },
    restart:{
      type: processObject,
      description: 'restart remux process',
      args: {
        id:{ type: GraphQLString}
      },
      resolve(value, args) {
        return JSON.stringify(args);
      }
    },
    info:{
      type: processObject,
      description: 'start remux process',
      args: {
        id:{ type: GraphQLString}
      },
      resolve(value, args) {
        return JSON.stringify(args);
      }
    }
  }
})



const RemuxProcessorSchema = new GraphQLSchema({
    query: processorObject
})


module.exports = RemuxProcessorSchema;
