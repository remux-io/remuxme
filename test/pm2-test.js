
"use strict"

const pm2 = require('pm2');



pm2.connect(function(err){
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.list(function(err, processes){
    processes.forEach(function(proc){
      console.log(proc);
    })
  })

  // pm2.describe('remux_ffmpeg_btv', function(err, app){
  //   console.log('err:',err);
  //   console.log('app:',app);
  // })
})
