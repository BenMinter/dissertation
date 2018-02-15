//MAIN
$(document).ready(function(){
  //get history if localstorage is available
  if(typeof(Storage)!=="undefined" && localStorage.getItem("history") !== null)
    history = new Set(JSON.parse(localStorage.getItem("history")));

  //manage CSS Layout and add listener
  UIController.updateUIforWidth();
  $(window).resize(function(){
    UIController.updateUIforWidth();
  });

  //generate initial recommendations
  generateRecommendations();

  //Start WebRTC initialisation.
  localAudio = document.getElementById('localAudio');
  remoteAudio = document.getElementById('remoteAudio');
  if(navigator.mediaDevices.getUserMedia)
      navigator.mediaDevices.getUserMedia(WebRTCConstraints).then(getUserMediaSuccess).catch(errorHandler);
  else
      WEBRTC_SUPPORT = false;
});

//Manage time between searches so YouTube API is not spammed.
function getSearches(query){
  clearTimeout(searchTimer);
  searchTimer = setTimeout(function(){searcher.searchYouTube(query,MAX_RESULTS,"")},500);
}

function addComments(){
  $.post("scripts/addComment.php",{comment:$("#comments").val()})
    .done(function(data){
      alert("Thank you! Comments are greatly appreciated!");
  });
  return false;
}

//Changes whether group history is used or personal history.
function historyUsage(check){
  let temp = history;
  history = roomHistory;
  roomHistory = temp;
}

//Callback function for search
function buildSearchResults(json){
  //reset search results so new ones can be generated
  resultsList.queue = [];
  for( let i = 0; i < json.items.length; i++ )
    resultsList.addItem(json.items[i].id.videoId, json.items[i].snippet.title);
  UIController.buildUIFromList(RESULTS_ID,resultsList,"col-sm-12","searchBox",true);

  //add click listener to add song to queue if clicked.
  $(".searchBox").click(function(){
    queueList.addItem(this.id,this.querySelector("#item-title").innerHTML);
    client.sendMessage("updateQueue");
    UIController.buildUIFromList(QUEUE_ID,queueList,"col-sm-12","queue",true);
  });
}

//Callback for recommendations
function buildRecommendations(json){
  //shuffle list for exploration
  let items = shuffle(json.items);
  //go through results adding first that isn't already in recommendations
  for(let i = 0; i < json.items.length; i++)
    if(!recList.exists(items[i].id.videoId)){
      recList.addItem(items[i].id.videoId, items[i].snippet.title);
      break;
    }
  //change col size based on width...
  UIController.buildUIFromList(RECOMMENDATIONS_ID,recList,"col-sm-6","recItem",true);

  //add listener to all buttons to add them to queue
  $(".recItem").click(function(){
    queueList.addItem(this.id,this.querySelector("#item-title").innerHTML);
    client.sendMessage("updateQueue");
    UIController.buildUIFromList(QUEUE_ID,queueList,"col-sm-12","queue",true);
  });
}

function generateRecommendations(){
  //get random items from queue
  let tempQueue = queueList.getData();
  tempQueue = shuffle(tempQueue);
  //reset recommendations
  recList.queue = [];
  //Recommendations Algorithms
  //#1 based on what is currently in the queue (Current Mood)
  //#2 based on user history (General Taste) get random item from history.
  //#3 Explorative Recommendation based on trending if no history or queue
    for( let i = 0; i < MAX_RECOMMENDATIONS; i++ ){
      if( i < 3 && typeof(tempQueue[i]) !== "undefined" )
        searcher.searchYouTube("",10,tempQueue[i].id);
      else if( typeof(history) !=="undefined" && history.size > 0)
        searcher.searchYouTube("",5,Array.from(history)[(Math.floor(Math.random()*history.size))]);
      else
        searcher.searchYouTube("",10,"");
  }
}

//When a song is clicked handled here.
function playSong(id){
  console.log("Song Clicked");
  player.loadVideoById(id);
  queueList.removeItem(id);
  UIController.buildUIFromList(QUEUE_ID,queueList,"col-sm-12","queue",true);
  addItemToHistory(id);
  //Delay so player can update id, ensuring correct song is chosen.
  setTimeout(function(){
    client.sendMessage("init");
  },200);
  generateRecommendations();
}

//Autoplay functionality.
function playNextInQueue(){
  //Gets head deletes and plays it
  let next = queueList.getHead();
  if(next != null){
    queueList.removeItem(0);
    UIController.buildUIFromList(QUEUE_ID,queueList,"col-sm-12","queue",true);
    player.loadVideoById(next.id);
    addItemToHistory(next.id);
    prevCTime=0;
  }
  generateRecommendations();
}
//helper to add item into history.
function addItemToHistory(id){
  history.add(id);
  if(typeof(Storage) !== "undefined")
    localStorage.setItem("history",JSON.stringify(Array.from(history)));
}

//update room UI
function updateRooms(msg){
  //setup room list from server
  roomList.queue = [];
  contactsList.queue = [];
  //create UI list to display available rooms
  for( let i = 0; i < msg.rooms.length; i++ ){
    let currentRoom = client.getRoom() == msg.rooms[i].id ? " <i id='currentRoom' style='color:red' class='fa fa-bell'></i>" : "";
    roomList.addItem(msg.rooms[i].id,"<b>"+ msg.rooms[i].id + " "+currentRoom+"</b><br>Users " + msg.rooms[i].users);
    if(currentRoom != ""){
      for( let j = 0; j < msg.rooms[i].ips.length; j++)
        contactsList.addItem(msg.rooms[i].ips[j],"User <b>" + msg.rooms[i].ips[j] + "</b>");
      UIController.buildUIFromList(CONTACTS_ID,contactsList,"col-sm-12","contact",false);
    }
  }
  UIController.buildUIFromList(ROOMLIST_ID,roomList,"col-sm-12","roomBox",false);

  //Set click listeners so user can change room.
  $(".roomBox").click(function(){
    client.setRoom(this.id);
    client.sendMessage("rooms");
  });

  $("#roomsTab").html("Rooms (" + msg.rooms.length + ")");
}

//Helper shuffle funtion.
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
