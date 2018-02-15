//Global Config...
var MAX_RESULTS = 10;
var MAX_RECOMMENDATIONS = 8;
var SERVER_IP = "81.109.145.99";
var SERVER_PORT = "15001";
var EXTERNAL_IP = "ec2-34-213-203-57.us-west-2.compute.amazonaws.com";
var YOUTUBE_API = "AIzaSyBqB-sk-Aqmd3mBT2COOgOmKNpi8nvZuXc";

//IDs for UI
var QUEUE_ID = "queueList";
var RESULTS_ID = "results";
var ROOMLIST_ID = "roomList";
var CONTACTS_ID = "contactsList";
var RECOMMENDATIONS_ID = "recommender";
//IDs for Client
var uuid = uuid();

//Networking variables
let client = new Client(SERVER_IP,SERVER_PORT);
let searcher = new Searcher(YOUTUBE_API);
let searchTimer;

//UI Lists.
let resultsList = new Queue();
let queueList = new Queue();
let roomList = new Queue();
let recList = new Queue();
let contactsList = new Queue();

//History Variables
let history = new Set();
let roomHistory;
let HISTORY_ROOM = false;

//UIManager
let UIController = new UIManager();

//WebRTC Variables
var WEBRTC_SUPPORT = true;
var localAudio;
var remoteAudio;
var peerConnections = [];
var peerConnectionConfig = {
    'iceServers': [
        {'urls': 'stun:stun.services.mozilla.com'},
        {'urls': 'stun:stun.l.google.com:19302'},
    ]
};
var WebRTCConstraints = {
    video: false,
    audio: true,
};

//YouTube API Variables
var CHECK_SENSIVITY = 500;
var AUTOMUTE = true;
var INITIAL_VIDEO_ID = "SWwfT8yyz0Y";
var done = false, serversent = false, ready=false, videoRequested = false;
var player, sync;
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//Seekbar Constraints in Milliseconds
let checkSeekTime = 500, prevCTime = 0;
