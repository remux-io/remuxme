

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
  description: 'Remux-ffmpeg Process.',
  fields: {
    name: {
      type: GraphQLString,
      description: 'Remux-ffmpeg Process Name.'
    },
    description:{
      type: GraphQLString,
      description: 'Remux-ffmpeg Process Description.'
    },
    program: {
      type: GraphQLString,
      description: 'Remux-ffmpeg Process Program.'
    },
    args: {
      type: new GraphQLList(GraphQLString),
      description: 'Remux-ffmpeg Process Ffmpeg args.'
    },
    cpus: {
      type: GraphQLString,
      description: 'Remux-ffmpeg Process CPU affinity.'
    },
    template: {
      type: GraphQLString,
      description: 'Ffmpeg template name used for processs.'
    },
    variables: {
      type: new GraphQLList(setObject),
      description: 'Settings for template.'
    }
  }
});


const processInfoObject = new GraphQLObjectType({
  name: 'ProcessInfo',
  description: 'Remux-ffmpeg Process Information',
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


const processFullInformationObject = new GraphQLObjectType({
  name: 'ProcessFullInformation',
  description: 'Remux-ffmpeg Process full information',
  fields: {
    id: { type: GraphQLString },
    description: { type: GraphQLString },
    name: { type: GraphQLString },
    cpus: { type: GraphQLString },
    program: { type: GraphQLString },
    pid: { type: GraphQLString },
    pm_id: { type: GraphQLString },
    cpu: { type: GraphQLString },
    mem: { type: GraphQLString },
    status: { type: GraphQLString },
    uptime: { type: GraphQLString },
    restarts: { type: GraphQLString }
  }
})



const processObject = new GraphQLObjectType({
  name: 'Process',
  description: 'Remux-ffmpeg Process',
  fields: {
    id: { type: GraphQLInt },
    configuration: { type: processConfigObject },
    status: { type: processInfoObject }
  }
})



const templateInputObject = new GraphQLInputObjectType({
  name: 'TemplateInput',
  description: 'Input set object.',
  fields:{
    name:{
      type: GraphQLString,
      description: 'Template name.'
    },
    args:{
      type: new GraphQLList(GraphQLString),
      description: 'Ffmpeg parameters'
    },
    program: {
      type: GraphQLString,
      description: 'Path to ffmpeg binary file.'
    }
  }
})


const templateObject = new GraphQLObjectType({
  name: 'Template',
  description: 'Ffmpeg template',
  fields: {
    name:{
      type: GraphQLString,
      description: 'Template name.'
    },
    args:{
      type: new GraphQLList(GraphQLString),
      description: 'Ffmpeg parameters'
    },
    program: {
      type: GraphQLString,
      description: 'Path to ffmpeg binary file.'
    }
  }
})



const templatesObject = new GraphQLObjectType({
  name: 'Templates',
  description:'Templates management.',
  fields:{
    list:{
      type: new GraphQLList(templateObject),
      resolve(value, args, request){
        return config.templates.list()
      }
    },
    info:{
      type: templateObject,
      args: {
        name:{type: GraphQLString}
      },
      resolve(value, args, request){
        return config.templates.info(args.name)
      }
    },
    get:{
      type: GraphQLString,
      args: {
        name:{type: GraphQLString},
        variable:{type: GraphQLString},
      },
      resolve(value, args, request){
        var result = config.templates.set(args.name, args.variable)
        if (typeof result != "object"){
          return [result]
        }else{
          return result
        }
      }
    },
    set:{
      type: templateObject,
      args: {
        name:{type: GraphQLString},
        variable:{type: GraphQLString},
        value:{type: GraphQLString}
      },
      resolve(value, args, request){
        var res = config.templates.set(args.name, args.variable, args.value)

        if(res){
          return new Error("new value not updated");
        }else if (args.variable != "name"){
          return config.templates.info(args.name)
        }else{
          return config.templates.info(args.value)
        }
      }
    },
    add:{
      type: templateObject,
      args: {
        object: {
          type: templateInputObject
        }
      },
      resolve(value, args, request){
        console.log(args);
        return config.templates.add(args.object)
      }
    },
    remove:{
      type: GraphQLString,
      args:{
        name:{type: GraphQLString}
      },
      resolve(value, args, request){
        return config.templates.remove(args.name)
      }
    }
  }
})



const serverObject = new GraphQLObjectType({
  name: 'Server',
  description:'Server management.',
  fields:{
    stop:{
      type: GraphQLString,
      description: 'Stop Remux server.',
      resolve(value, args, request){
        var server = new server_api()
        server.stop(function(err, msg){})
        return "Stoping..."
      }
    },
    restart:{
      type: GraphQLString,
      description: 'Restart Remux server.',
      resolve(value, args, request){
        var server = new server_api()
        server.start(function(err, msg){})
        return "Restarting..."
      }
    },
    listSets:{
      type: new GraphQLList(setObject),
      description: 'Return list of sets and values.',
      resolve(value, args, request) {
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
      resolve(value, args, request) {
        return config.remux.set(args.param.variable, args.param.value)
      }
    },
    get:{
      type: GraphQLString,
      description: 'Get variable value.',
      args: {
        variable:{ type: GraphQLString}
      },
      resolve(value, args, request) {
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
      resolve(value, args, request) {

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
      resolve(value, args, request) {

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
      resolve(value, args, request) {

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
      resolve(value, args, request) {
        if (isNaN(args.id)) return null

        return new Promise(function(resolve){
          var api = new remuxme_pm2_api();
          api.start(args.id,function(err, result){
            return resolve(result)
          })
        })
      }
    },
    info:{
      type: processFullInformationObject,
      description: 'start remux process',
      args: {
        id:{ type: GraphQLInt}
      },
      resolve(value, args, request) {
        return new Promise(function(resolve){
          var api = new remuxme_pm2_api();
          api.info(args.id,function(err, result){
            return resolve(result)
          })
        })
      }
    },
    set:{
      type: GraphQLString,
      description: 'Set variable value.',
      args: {
        id: {type: GraphQLInt},
        param:{ type: setInputObject}
      },
      resolve(value, args, request) {
        return config.processes.set(args.id, args.param.variable, args.param.value)
      }
    },
    get:{
      type: GraphQLString,
      description: 'Get variable value.',
      args: {
        id: {type: GraphQLInt},
        variable:{ type: GraphQLString}
      },
      resolve(value, args, request) {
        return config.processes.get(args.id, args.variable)
      }
    },
    cpus:{
      type: GraphQLString,
      description: 'Set cpu affinity.',
      args: {
        id:{ type: GraphQLInt},
        cpus: {type: GraphQLString}
      },
      resolve(value, args, request) {
        return new Promise(function(resolve){
          var api = new remuxme_pm2_api();
          api.cpus(args.id, args.cpus,function(err, result){
            if (err){
              return resolve(err.toString())
            }else{
              return resolve(result.success.toString())
            }
          })
        })
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
    },
    templates:{
      type: templatesObject,
      resolve(){
        return templatesObject
      }
    }
  }
})

const RemuxProcessorSchema = new GraphQLSchema({
    query: Remux
})


module.exports = RemuxProcessorSchema;
