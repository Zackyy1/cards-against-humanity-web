
var express = require("express");
var app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
var https = require("https");
var http = require("http");
var fs = require("fs");
var path = require("path");
var admin = require("firebase-admin");
var serviceAccount = require("./cah-web-4f057-firebase-adminsdk-54ath-29f0561f4f.json");


  const html = __dirname + '/dist/cards-against-humanity';
  const apiUrl = '/api';
  const port = 443;


  // Start server

  const key = fs.readFileSync('./cards.rendemental.com.key');
  const cert = fs.readFileSync('./cards_rendemental_com.crt');
  const ca = fs.readFileSync('./cards_rendemental_com.ca-bundle');

  var forceSsl = require('express-force-ssl');


const cors = require('cors')({origin: '*'});


// app
  app
  .use(compression())
  .use(cors)
  .use(bodyParser.json())
  .use(express.static(html))
  .use(function(req, res) {
    
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Origin', 'https://90.190.166.179:4444');
    res.setHeader('Access-Control-Allow-Origin', 'https://cards.rendemental.com');
    res.setHeader('Access-Control-Allow-Origin', 'https://cards.rendemental.com:4444');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.sendFile(html + '/index.html');
    // next();
    })
 
// .use((req, res, next) => {
//    if(req.protocol === 'http') {
//      res.redirect(301, `https://${req.headers.host}${req.url}`);
//    }
//    next();
// })

  var server = https.createServer(
      {
          key,
          cert,
          ca,
    // hostname: 'cards.rendemental.com',
    // port: port, 
    requestCert: false,
    rejectUnauthorized: false}, 
app);
  
  var server2 = http.createServer(app);
  

  server.listen(port, function () {
        console.log('Started listening on '+port)
  });

//   server2.listen(4443, '0.0.0.0', function () {
//     console.log('Started listening on *4443')
// });


 
var io = require('socket.io').listen(server);

// io.set('origins', /*your desired origins*/);

io.set('transports', ['websocket',
    'flashsocket',
    'htmlfile',
    'xhr-polling',
    'jsonp-polling',
    'polling']);

//   var io = require("socket.io")(server);

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
  
//-------------------------------------------------------------------------------------------------------


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
  const room2 = getRoom(roomCode).then(e => {
    let room = e.toJSON();
    room = parseRoom(room);
    room &&
      room.players.map(player => {
        if (player.name == playerName) {
          player.isReady = true;
          room.readyPlayers++;
          console.log(playerName, "is now ready");
          if (room.players.length == room.readyPlayers) {
            console.log("All players ready, starting game");
            room["gameStatus"] = "game";
            room = startGameForRoom(room);
          }
          startRound(roomCode, room);
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
    // console.log("Working on", obj[key]);
  });
  room.players = arr;
  return room;
}

function objectToArray(obj) {
  let arr = [];
  var arr_obj = Object.keys(obj).map(key => {
    arr.push(obj[key]);
  });

  return arr;
}

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

function startRound(roomCode, room) {
  room = parseRoom(room);
  // Assign a black card to the room
  const randomCart = originalDeck.black.random();
  room["black"] = { text: randomCart.text, pick: randomCart.pick };
  console.log("Assigning a black card:", room["black"]);

  // Choose a czar
  room["czar"] = room.players.random().name;
  console.log("Assigning a czar:", room["czar"]);

  // Wait for all to select cards
  room["selectedCards"] = {};
}

function startGameForRoom(room) {
  /**
   * Create a copy of deck
   * Deal cards and remove dealt cards from deck
   * Show cards for every user
   */
  // console.log('STARTING GAME:', room)
  let players = room.players;

  players.map(player => {
    let cards = (player["cards"] = []);
    for (let i = 0; i < 10; i++) {
      let cardToDeal = originalDeck.white.random();
      // cardToDeal = originalDeck.white.random()
      // cardToDeal = originalDeck.white.random()
      player.cards.push(cardToDeal);
    }
    player.cards = objectToArray(player.cards);
  });

  updateRoomDb(room.room, room);
  updateRoom(room.room);

  return room;
}

async function getRoom(roomCode) {
  return await db
    .ref("/rooms/" + roomCode.toString())
    .once(await "value", e => {
      const res = e.toJSON();
      // console.log("Room #" + roomCode.toString(), res);
      let obj = res.players;
      let arr = [];
      var arr_obj = Object.keys(obj).map(key => {
        arr.push(obj[key]);
        // console.log("Working on", obj[key]);
      });
      res.players = arr;
      // console.log("DEBUG", res);
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

  socket.on("restartRound", room => {
    startRound(room.room, room);
    updateRoomDb(room.room, room);
    updateRoom(room.room);
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

  // socket.on("cardsChosen", (room, player) => {
  //   console.log(player.name,'has chosen a card. It\'s:', player.chosenCards)
  // })

  socket.on("cardSelected", obj => {
    // let room = obj.room;
    
    let room2 = getRoom(obj.room.room).then(room=> {
      room = parseRoom(room.toJSON())
      
      console.log('WHAT IS THIS?', room)
      let player = obj.player;
      let cards = obj.cards;
      // console.log('Recieved:', room, player, cards)
      // room = parseRoom(room)
  
  
      cards = objectToArray(cards)
      room.players.map(plr => {
        plr.cards = objectToArray(plr.cards)
        if (plr.name == player.name) {
          console.log(player.name, "has selected a card", cards);
          console.log('Checking selected cards:', room['selectedCards'])
          if (room["selectedCards"] == null) {
            room["selectedCards"] = {};
            console.log("RESET");
          }
          room["selectedCards"][player.name] = cards[0];
          console.log("Updated selected cards:", room["selectedCards"]);
          if (Object.keys(room['selectedCards']).length == room.players.length-1) {
            // All have chosen a card
            console.log('Everyone has chosen a card')
            io.emit('judgement'+room.room)
          }
          updateRoomDb(room.room, room);
        }
      });
      
      // updateRoom(room.room);
    })

    
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