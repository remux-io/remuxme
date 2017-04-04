const pm2 = require('pm2');

pm2.connect(function() {
  pm2.sendDataToProcessId( 1, {
    data : {
      'cmd':'taskset',
      'args':`0-3`
    },
    type : 'process:msg',
    topic: 'topic',
    id   : 1
  },
  function (err, res){
    console.log(err, res);
  })
});
