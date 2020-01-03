var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var game = [
    {
        room: '2323',
        players: ['alexey', 'morty'],

}
]

io.on('connection', function(socket) {
    // io.on('hello', e => {
    //     console.log(e)
    // })
    
    console.log('User connected')
    socket.on("hello", e => {
        console.log(e)
      });

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


      socket.on('disconnect', function(){
        console.log('user disconnected');
      });
});

http.listen(4444, function(){
  console.log('listening on *:4444');
});