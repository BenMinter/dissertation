const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const express = require('express');
let app = express();

const httpsserver = https.createServer({
  passphrase:'doge',
  cert:fs.readFileSync('keys/cert.cert'),
  key:fs.readFileSync('keys/pub.key')
},app).listen(15001);

var wss = new WebSocket.Server({
  server:httpsserver,
});


wss.broadcast = function(data,ws) {
    this.clients.forEach(function(client){
      if(client!=ws)
        client.send(data);
    });
};

wss.on('connection', function(ws) {
  console.log("IP: " + ws._socket.remoteAddress);
    ws.on('message', function(message) {
        wss.broadcast(message,this);
    });
});
