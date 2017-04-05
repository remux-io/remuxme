var socket = require('socket.io-client')('http://127.0.0.1:4444/');

console.log(socket.id)

socket.on('connect', function(){
  console.log(socket.id); // 'G5p5...'
  socket.emit('join', '0')
  socket.emit('join', '1')
    socket.emit('join', '2')
});


socket.on('log', function(data){
  console.log(data);
})
