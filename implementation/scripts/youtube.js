function onYouTubeIframeAPIReady() {
		player = new YT.Player('player', {
			height: '100%',
			width: '100%',
			videoId: INITIAL_VIDEO_ID,
			events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}
function onPlayerReady(event) {
	ready=true;
	//get initial data from server
	client.sendMessage("firstTime");
	client.sendMessage("rooms");
	//mute for testing
	if(AUTOMUTE)
		player.mute();
}
function handleMessage(msg){
serversent=true;
	switch(msg.action){
		case "init":
			init(msg);
			break;
		case "updatePlayer":
			//update player state to match given state.
			togglePlay(msg.data.playerData.state);
			break;
		case "updateQueue":
			//set new queue
			queueList.queue = msg.data.queueData;
			$("#queue").html(UIController.buildUIFromList(QUEUE_ID,queueList,"col-sm-12","queue",true));
			break;
		case "buffer":
			//synchronisation will fail here if networks are massively different.
			player.playVideo();
			break;
		case "ping":
			client.sendMessage("init");
			break;
		case "seek":
			updateSeekbar(msg);
			break;
		case "rooms":
			updateRooms(msg);
			break;
		case "rtc":
			gotMessageFromServer(msg);
			break;
		case "history":
			roomHistory = new Set(msg.data);
			break;
	}
	serversent= false;
}
function init(msg){
	//init queue
	queueList.queue = msg.data.queueData;
	$("#queue").html(UIController.buildUIFromList(QUEUE_ID,queueList,"col-sm-12","queue",true));
	//init player.
	if(msg.data.playerData.state != YT.PlayerState.PLAYING )
		player.cueVideoById(msg.data.playerData.cUrl,msg.data.playerData.cTime);
	else
		player.loadVideoById(msg.data.playerData.cUrl,msg.data.playerData.cTime);
}

function updateSeekbar(msg){
	player.seekTo(msg.data.playerData.cTime,true);
	prevCTime = msg.data.playerData.cTime;
}
function onPlayerStateChange(event) {
	console.log("STATE CHANGED: " + event.data );
	if(!serversent)
		switch(event.data){
			case YT.PlayerState.PAUSED:
				console.log("Player Paused Video.");
				client.sendMessage("updatePlayer"); break;
			case YT.PlayerState.PLAYING:
				console.log("Player Paused Video.");
				checkSeek();
				client.sendMessage("updatePlayer");
				break;
			case YT.PlayerState.ENDED:
				console.log("Player Ended Video.");
				playNextInQueue();
				break;
			case YT.PlayerState.BUFFERING:
				console.log("Player Buffering Video");
				client.sendMessage("buffer");
				break;
		}
}
function stopVideo() { player.stopVideo(); }

//Get nice object containing playback data
function getYTData(){
	if(ready)
		return {state:player.getPlayerState(), cTime:player.getCurrentTime(), cUrl:player.getVideoUrl().split("v=")[1]};
}
//Toggle playstate of YouTube player.
function togglePlay(state){
	switch(state){
		case YT.PlayerState.PAUSED: player.pauseVideo();break;
		case YT.PlayerState.PLAYING:  player.playVideo();break;
	}
}
function checkSeek(){
	//dont update on pause
	if(player.getPlayerState() != YT.PlayerState.PLAYING)
		return;
	let currentTime = player.getCurrentTime();
	//if something is playing
	if(prevCTime >= 0 ){
		let diff = (currentTime - prevCTime) * 1000;
		//if there is a change in the seekbar then update the others.
		if(Math.abs(diff-checkSeekTime) > (CHECK_SENSIVITY+100) && !serversent){
			client.sendMessage("seek");
		}
	}
	//remember currentime
	prevCTime = currentTime;
	//call the function again in x ms
	setTimeout(function(){
		return checkSeek();
	}, checkSeekTime);
}
