const server_api = require('../').server

function getCaption(caption){
  return `\n[@][${caption}]\n`
}

// get server
var server = new server_api()

//get all modules as object
var mods = server.getModules()
console.log(getCaption('modules'),mods);
// process.exit()

// list of available modules
console.log(getCaption('list modules settings'), mods.list());

//get remux module by name
var packetizer = mods.getByName('packetizer-remuxme')  //packetizer is remuxModule
//set variable of module
packetizer.set('host:address','0.0.0.0');
//get variable value of module config
console.log(getCaption('get module variable'), packetizer.get('host:port'));
//get all variables
console.log(getCaption('get module all variables'),packetizer.get());
//load module
packetizer.load(function(err){ //mod is remuxModule
  if (err){
    //if error print it
    console.log(getCaption('load module error'), err);
  }else{
    //if no error, print status
    packetizer.toJson(function(json){
      console.log(getCaption('load module'), json);
    })
  }
})

setTimeout(function(){
  //get module status
  packetizer.status(function(err, status){
    if (err){
      //if error print it
      console.log(err);
    }else{
      //if no error, print status
      packetizer.toJson(function(json){
        console.log(getCaption('status module'), json);
      })
    }
  })
},5000)
//stop module

setTimeout(function(){
  packetizer.unload(function(err){  //mod is remuxModule
    if (err){
      //if error print it
      console.log(getCaption('unload module error'),err);
    }else{
      //if no error, print status
      packetizer.toJson(function(json){
        console.log(getCaption('unload module'), json);
      })
    }
  })
}, 10000)
