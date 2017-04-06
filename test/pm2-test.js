
"use strict"

const pm2 = require('pm2');



pm2.launchBus(function(err, bus) {
  bus.on('process:event', function(process_event){
    console.log(process_event.event,
      process_event.process.pm_id,
      process_event.process.name);
  });
});
