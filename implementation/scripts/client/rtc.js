function getUserMediaSuccess(stream) {
  console.log("Got Media Success Function!");
    localStream = stream;
    localAudio.src = window.URL.createObjectURL(stream);
}
function start(isCaller) {
  for(let i = 0; i < contactsList.queue.length; i++ ){
    if(uuid !== contactsList.queue[i].id){
      peerConnections[contactsList.queue[i].id] = new RTCPeerConnection(peerConnectionConfig);
      peerConnections[contactsList.queue[i].id].onicecandidate = gotIceCandidate;
      peerConnections[contactsList.queue[i].id].onaddstream = gotRemoteStream;
      peerConnections[contactsList.queue[i].id].addStream(localStream);

      if(isCaller) {
          peerConnections[contactsList.queue[i].id].createOffer().then(function(description){
            peerConnections[contactsList.queue[i].id].setLocalDescription(description).then(function() {
                client.sendMessage("rtc",{'action':'rtc','sdp': peerConnections[contactsList.queue[i].id].localDescription, 'uuid': uuid});
            }).catch(errorHandler);
          }).catch(errorHandler);
      }
    }
  }
}
function gotMessageFromServer(message) {
    let signal = message.data;
    if(!peerConnections[signal.uuid])
      start(false);


    if(signal.sdp) {
      peerConnections[signal.uuid].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(function() {
          // Only create answers in response to offers
          if(signal.sdp.type == 'offer') {
              peerConnections[signal.uuid].createAnswer().then(function(description){
                peerConnections[signal.uuid].setLocalDescription(description).then(function() {
                    client.sendMessage("rtc",{'action':'rtc','sdp': peerConnections[signal.uuid].localDescription, 'uuid': uuid});
                }).catch(errorHandler);
              }).catch(errorHandler);
          }
      }).catch(errorHandler);
    } else if(signal.ice) {
        peerConnections[signal.uuid].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(errorHandler);
    }
}
function gotIceCandidate(event) {
    if(event.candidate != null) {
        client.sendMessage("rtc",{'ice': event.candidate, 'uuid': uuid});
    }
}

function gotRemoteStream(event) {
    remoteAudio.src = window.URL.createObjectURL(event.stream);
}
function errorHandler(error) {
    console.log(error);
}
//helper function to get ids
function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
