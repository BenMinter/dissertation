class Client{
  constructor(ip,port){
    this.ws = new WebSocket("wss://"+ip+":"+port);
    this.setupWS(this.ws);
    this.room = "default";
  }

  createAction(action,data){
    let datatosend = data ? data : this.getData();
    console.log(datatosend);
    return JSON.stringify({action:action,room:this.room,data:datatosend});
  }
  //gets required data to be sent to server.
  getData(){return {playerData:getYTData(),queueData:queueList.getData(),history:Array.from(history),uuid:uuid};}

  sendMessage(action,data){
    if(this.ws.readyState == WebSocket.OPEN)
      this.ws.send(this.createAction(action,data));
    }

  setRoom(room){
    this.sendMessage("leaveRoom");
    this.room = room;
    this.sendMessage("firstTime");
  }
  
  getRoom(){ return this.room; }

  setupWS(ws){
    let that = this;
    ws.onmessage = function(e){
      console.log(e.data);
      try{
        handleMessage(JSON.parse(e.data));
      }catch(e){
        console.log(e);
      }
    };
    ws.onopen = function(){
      if(player!= null){
    		client.sendMessage("firstTime");
        client.sendMessage("rooms");
      }
      console.log("Server Connection - Successful");
    };
    ws.onclose = function(){
      console.log("Server Connection - Closed");
    };
  }

}
