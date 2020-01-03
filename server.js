var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var game = [];

function getRoom(roomCode) {
  for (room in game) {
    if (game[room]['room'] == roomCode.toString()) {
      return game[room]
    }
  }
}

io.on('connection', function(socket) { 
    console.log('User connected');
    

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

     socket.on('join', roomCode => {
        const toFindRoom = getRoom(roomCode.code)

          if ( toFindRoom && toFindRoom['room'] == roomCode.code) {
            console.log('Game exists, user', roomCode.name, 'is joining room #'+roomCode.code)
            socket.emit('joinResponse', 
            {roomCode: roomCode.code, 
              name: roomCode.name,
              code: 'SUCCESS'});

              toFindRoom.players.push(
                {name: roomCode.name, 
                  cards: [], 
                  score: 0,
                  isReady: false,
                })

              updateRoom(roomCode.code)
              return true;
          } else {
            console.log('Game does not exist')
            socket.emit('joinResponse', 
            {roomCode: roomCode.code, 
              name: roomCode.name,
              code: 'ERROR',
              body: 'Room not found'});
              return false;
          }
       
     })

      socket.on('createRoom', info => {
        game.push(
          {
            room: info.roomCode.toString(),
            host:  info.name,
            voters: [],
            czar: '',
            deck: {whites: [], blacks: []},
            trash: [],
            readyPlayers: 1,
            players: [
              {
                name: info.name,
                cards: [],
                score: 0,
                isReady: true,
              },
          ],
    }
        )
        console.log('Created new room:', game)
        socket.emit('joinCreatedRoom', {roomCode: info.roomCode})
        updateRoom(info.roomCode)
      });

      socket.on('ready', e => {
        setReady(e.roomCode, e.name)
      })

      function updateRoom(roomCode) {

        console.log('SENDING', 'roomUpdate'+roomCode)
        io.emit('roomUpdate'+roomCode.toString(), {
          room: getRoom(roomCode)
        })
      }

      function setReady(roomCode, playerName) {
        console.log(roomCode, playerName)
        const room = getRoom(roomCode)
        room && room.players.map(player => {

          if (player.name == playerName) {
            player.isReady = true
            room.readyPlayers++;
            console.log(playerName,'is now ready')
            updateRoom(roomCode)
            return true
          }
        })
      }
      

      socket.on('requestUpdate', e => {
        updateRoom(e)
      })

      socket.on('getInfo', e => {
        const room = getRoom(e);
        console.log('----\n',room,'\n----')
        
      })

      socket.on('disconnect', e => {
        console.log('user disconnected', e);
      });
});


  http.listen(4444, function(){
    console.log('listening on *:4444');
  })


app.get('/', function(request, response){
  console.log('Hello!')
});