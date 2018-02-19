'use strict';
//Library Imports from Node
const ws = require("ws");
const Room = require("./room.js");
const https = require('https');
const fs = require('fs');
const express = require('express');
let app = express();
var rooms = [];
//create server to handle incoming requests.
const httpsserver = https.createServer({
  passphrase:'doge',
  cert:fs.readFileSync('keys/cert.cert'),
  key:fs.readFileSync('keys/pub.key')
},app).listen(15001);


console.log("Listening");
const server = new ws.Server({server:httpsserver});

server.on('connection', function connection(ws) {
  console.log("Connection Received.");
  console.log(ws._socket.remoteAddress);
  ws.on('message', function incoming(message) {
        handleMessage(ws,message);
  });

  ws.on('close', function() {
    console.log("Client Disconnect");
    rooms[ws.room].removeClient(ws);
  });
});

//action functions
function firstTimeConnection(json,ws){
  ws.uuid = json.data.uuid;
  //create room if it doesn't exist, add client to room if it does and get information about room from user in room.
  if(rooms[json.room] != undefined){
    rooms[json.room].addClient(ws);
    console.log(getRooms());
    if(rooms[json.room].CLIENTS.length > 1 )
      rooms[json.room].CLIENTS[0].send(JSON.stringify({action:"ping"}));
  }else{
    createRoom(json.room,ws);
  }
  rooms[json.room].addHistory(json.data.history);
  rooms[json.room].broadcast(JSON.stringify({action:"rooms",rooms:getRooms()}),ws);
}

function handleMessage(ws,message){
  let json = parseMessage(message);
  if(json!=undefined){
      ws.room = json.room;
      switch(json.action){
        case "firstTime":
          firstTimeConnection(json,ws);break;
        case "rooms":
          ws.send(JSON.stringify({action:"rooms",rooms:getRooms()}));break;
        case "leaveRoom":
          rooms[json.room].removeClient(ws);break;
        default:
          rooms[json.room].broadcast(message,ws);break;
      }
  }
}



//helper functions

function parseMessage(msg) {
  //try parsing a JSON obj if not JSON catch exception.
  try{
    return JSON.parse(msg);
  }catch(e){
    console.log("Invalid JSON obj");
  }
  return null;
}

function getRooms(){
  let data = [];
  for(let room in rooms )
    data.push({id:rooms[room].getID(),users:rooms[room].getNumUsers(),ips:rooms[room].getIPS()});
  return data;
}



function handleAction(jsonMsg) {
  //handle message based on the action in the JSON obj
  switch(jsonMsg.action){
    case "firstTime":
      return
    case "updateQueue":
      //Store Queue
      return JSON.stringify(jsonMsg);
  }
  return JSON.stringify(jsonMsg);
}

function createRoom(id, ws) {
  if(id!=undefined){
    console.log("Room Created with id: " + id);
    rooms[id] = new Room(id,rooms);
    rooms[id].addClient(ws);
  }
}
