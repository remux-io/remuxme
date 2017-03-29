
"use strict"

const pm2 = require('pm2');



pm2.connect(function(err){
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.list(function(err, processes){
    processes.forEach(function(proc){
      console.log(proc.name, '-->', proc.pm2_env.status);
    })
  })

})


pm2.launchBus(function(err, bus) {
  bus.on('log:out', function(data){
    console.log(data);
  });
});
