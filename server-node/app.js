/* gobal require */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = [];

var getConnectedClientsDetails = function(){
    return clients.map(function(elem){
        if(elem.connected === true){
            return {'username': elem.username, 'id': elem.id};
        }
    });
};

var getConnectedSocket = function(){
    return clients.map(function(elem){
        if(elem.connected === true){
            return elem.socket;
        }
    });
};

var getSocketById = function(id){
    for(var i = 0, len = clients.length; i < len; i++){
        console.log(clients[i].id);
        if(clients[i].id == id)
        {
            return clients[i];
        }
    }
};

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){
  
  socket.on('chat message', function(msg){
    socket.broadcast.emit('chat received', {'msg': msg});
  });
  
  socket.on('private chat message to', function(data){
    getSocketById(data.to).socket.emit('private chat received', data);
  });
  
  
    socket.on('ready', function(username){

        clients.push({'username': username, connected: true, 'id': socket.id, 'socket': socket});

        socket.emit('ready back', {'user': {'username': username, 'id': socket.id, 'connected': true }});

        for (var i = 0, len = getConnectedSocket().length; i < len; i++) {
            getConnectedSocket()[i].emit('conncted user', {'users': getConnectedClientsDetails()});
        }

    
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    