var express = require("express");
var app = express();
var https = require("https");
var http = require("http");
var bodyParser = require('body-parser');
var fs = require("fs");
var admin = require("firebase-admin");

var serviceAccount = require("./cah-web-4f057-firebase-adminsdk-54ath-29f0561f4f.json");

app.use(bodyParser.json())

var server = http.createServer(
  {
    key: fs.readFileSync('./cards.rendemental.com.key', 'utf-8').toString(),
    cert: fs.readFileSync('./cards_rendemental_com.crt', 'utf-8').toString(),
    ca: fs.readFileSync('./cards_rendemental_com.ca-bundle', 'utf-8').toString(),
    // hostname: 'cards.rendemental.com',
    // port: 443, 
    requestCert: false,
    rejectUnauthorized: false
  },
  app
);

server.listen(4444, function() {
  console.log("listening on *:4444");
});


var io = require("socket.io")(server);
io.set('transports', ['websocket',
    'flashsocket',
    'htmlfile',
    'xhr-polling',
    'jsonp-polling',
    'polling']);
    
const originalDeck = JSON.parse(fs.readFileSync("cards-extended.json"));

var game = [];

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cah-web-4f057.firebaseio.com/",
  databaseAuthVariableOverride: {
    uid: "firebase-adminsdk-54ath@cah-web-4f057.iam.gserviceaccount.com"
  }
});
var db = admin.database();

function updateRoom(roomCode) {
  getRoom(roomCode.toString()).then(e => {
    // console.log('SENDING ROOM!!', e)
    let res = e.toJSON();
    res = parseRoom(res);
    io.emit("roomUpdate" + roomCode.toString(), res);
  });
}

function setReady(roomCode, playerName) {
  console.log(roomCode, playerName);
  const room = getRoom(roomCode).then(e => {
    let room = e.toJSON();
    room = parseRoom(room);
    room &&
      room.players.map(player => {
        if (player.name == playerName) {
          player.isReady = true;
          room.readyPlayers++;
          console.log(playerName, "is now ready");
          if (room.players.length == room.readyPlayers) {
            console.log('All players ready, starting game')
            room['gameStatus'] = 'game'
          }
          updateRoomDb(roomCode, room);
          updateRoom(roomCode);
          return true;
        }
      });
  });
}

function parseRoom(room) {
  let obj = room.players;
  let arr = [];
  var arr_obj = Object.keys(obj).map(key => {
    arr.push(obj[key]);
    console.log("Working on", obj[key]);
  });
  room.players = arr;
  return room;
}




async function getRoom(roomCode) {
  return await db
    .ref("/rooms/" + roomCode.toString())
    .once(await "value", e => {
      const res = e.toJSON();
      console.log("Room #" + roomCode.toString(), res);
      let obj = res.players;
      let arr = [];
      var arr_obj = Object.keys(obj).map(key => {
        arr.push(obj[key]);
        console.log("Working on", obj[key]);
      });
      res.players = arr;
      console.log("DEBUG", res);
      return res;
    });
}

function updateRoomDb(roomCode, updatedRoom) {
  return db.ref("/rooms/" + roomCode).update(updatedRoom);
}


io.on("connection", function(socket) {
  console.log("User connected");

  /**
   * Todo:
   * User joins game (enterGame, 2323) ->
   * Store user in local database
   *
   * Gather users until hosts presses "BEGIN"
   *
   * When host pressed begin, deal 10 random cards to users
   *
   * Select a random black card
   *
   * A Tzar is chosen, awaiting all users to select a white card
   *
   * When all users have finished selected cards, initiate
   * Voting sequence.
   * Tzar votes for the best card and the user gets a point
   *
   * ADDITIONAL:
   * Users can swap bad cards for points if they wish to
   * MULTIPLE CARDS can be chosen, so we'll figure that out
   *
   *
   */

  socket.on("join", roomCode => {
    getRoom(roomCode.code.toString()).then(e => {
      let toFindRoom = e.toJSON();
      toFindRoom = parseRoom(toFindRoom);
      if (toFindRoom && toFindRoom["room"] == roomCode.code) {
        console.log(
          "Game exists, user",
          roomCode.name,
          "is joining room #" + roomCode.code
        );
        socket.emit("joinResponse", {
          roomCode: roomCode.code,
          name: roomCode.name,
          code: "SUCCESS"
        });

        toFindRoom.players.push({
          name: roomCode.name,
          cards: [],
          score: 0,
          isReady: false
        });
        updateRoomDb(roomCode.code, toFindRoom);
        updateRoom(roomCode.code);
        return true;
      } else {
        console.log("Game does not exist");
        socket.emit("joinResponse", {
          roomCode: roomCode.code,
          name: roomCode.name,
          code: "ERROR",
          body: "Room not found"
        });
        return false;
      }
    });
  });

  socket.on("createRoom", info => {
    let newRoom = {
      room: info.roomCode.toString(),
      host: info.name,
      voters: [],
      czar: "",
      deck: { whites: [], blacks: [] },
      trash: [],
      readyPlayers: 1,
      players: [
        {
          name: info.name,
          cards: [],
          score: 0,
          isReady: true
        }
      ]
    };
    updateRoomDb(info.roomCode.toString(), newRoom);
    // console.log('Created new room:', game)
    socket.emit("joinCreatedRoom", { roomCode: info.roomCode });
    updateRoom(info.roomCode);
  });

  socket.on("ready", e => {
    setReady(e.roomCode, e.name);
  });

  socket.on("startGameForRoom", room => {
    /**
     * Create a copy of deck
     * Deal cards and remove dealt cards from deck
     * Show cards for every user
     */

    

  });

  socket.on("requestUpdate", e => {
    updateRoom(e);
  });

  socket.on("getInfo", e => {
    const room = getRoom(e);
    console.log("----\n", room, "\n----");
  });

  socket.on("disconnect", e => {
    console.log("user disconnected", e);
  });
});

// app.get('/', (req, res) => {
//   console.log(req, res)
// })





