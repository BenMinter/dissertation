'use strict';

class Room{

  constructor(roomid,rooms){
    this.rooms = rooms;
    this.roomid = roomid;
    this.HISTORY = new Set();
    this.CLIENTS = [];
  }

  addClient(ws){
    //only add client if they don't exist.
    if(this.CLIENTS.indexOf(ws) < 0 ){
      console.log("Added Client to " + this.roomid);
      this.CLIENTS.push(ws);
    }
  }


  addHistory(historySet){
  //  console.log(historySet);
    for(let i = 0; i < historySet.length; i++)
      this.HISTORY.add(historySet[i]);
    this.broadcast(JSON.stringify({roomid:this.getID(), action:"history", data:this.getHistory()}), null);
  }

  removeClient(ws){
    //only remove client if they exist.
    if(this.CLIENTS.indexOf(ws) > -1)
      this.CLIENTS.splice(this.CLIENTS.indexOf(ws),1);
    if(this.CLIENTS.length <= 0 ){
      delete this.rooms[this.roomid];
    }
  }

  broadcast(data,sender){
    this.CLIENTS.forEach(function(client){
      //don't broadcast message to sender
      if(client != sender)
        client.send(data);
    });
  }

  getID(){
    return this.roomid;
  }
  getHistory(){
    return Array.from(this.HISTORY);
  }

  getIPS(){
    let ips=[];
    for(let item in this.CLIENTS)
        ips.push(this.CLIENTS[item].uuid);
    return ips;
  }


  getNumUsers(){
    return this.CLIENTS.length;
  }

};
module.exports = Room;
