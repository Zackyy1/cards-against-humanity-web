import { Component, OnInit, Input, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  roomCode: any;
  room: any;
  myName: string;
  cardsShown: boolean = false
  myCards
  myScore: number
  helperText: string = "Game is on!"
  currentCardInFrontIndex = 1
  isJudging: boolean = false
  winner = null

  @Output() selectedCards: Array<string> = []
  

  constructor(private socket: Socket,
    private cookie: CookieService,
    private router: Router) {
      this.myName = cookie.get('name')
    console.log('My name is', this.myName)

    const url = document.URL
    this.roomCode = Number(url.substring(url.search('game/')+'game/'.length, url.length))
    
    
     }

  ngOnInit() {

    $('.my-cards-button').click( e => {
      this.showMyCards();
    })

    window.scrollTo(0, 0)
    this.socket.emit('requestUpdate', this.roomCode.toString())
    this.socket.on('roomUpdate'+this.roomCode.toString(), room => {
      console.log('Update recieved:', room)
      this.room = room
      
      this.room.players.map(plr => {
        // plr.cards = this.objectToArray(plr.cards)c
        plr.cards = this.objectToArray(plr.cards)
        // console.log('Comparing', plr, this.myName)
        if (plr.name == this.myName) {
          this.myCards = plr.cards
          return true
        }
      })
      if (this.room && this.room['selectedCards'] && Object.keys(this.room['selectedCards']).length == this.room.players.length - 1) {
        this.room['selectedCardsArray'] = this.objectToArray(this.room['selectedCards'])
        // Turn cards of players into arrays
        for (let plr in this.room['selectedCards']) {
          this.room['selectedCards'][plr] = [this.room['selectedCards'][plr]]
        }
        this.judgement()
      }
    })

    this.socket.on('judgement'+this.roomCode, e => {
      this.judgement()
    })

    this.socket.on('winner'+this.roomCode.toString(), e => {
      console.log('Recieved winner:', e)
      this.winner = e;
      // $('.winner-label').addClass('winner-show')
      this.isJudging = false;
      this.helperText = e.name+' has won! Score: ' + e.score
      let score = this.getMyScore()
      setTimeout(() => {
        this.helperText = "Game is on! My score: " + score
        this.winner = null
      }, 5000);
    })

    


  }

  getMyScore() {
    let toReturn = -1
    this.room.players.map(plr => {
      if (plr.name == this.myName) {
        toReturn = plr.score
      }
    })
    return toReturn
  }

  objectToArray(obj) {
    let arr = [];
    var arr_obj = Object.keys(obj).map(key => {
      arr.push(obj[key]);
    });
   
    return arr;
  }

  overlapAll(e) {
    const clickedOn = $(e.target)

    $('.white-card-judgement').css('z-index', '300')
    if (clickedOn.hasClass('white-card-text')) {
      console.log('CHECK')
      console.log($(clickedOn[0].parentElement))
      $(clickedOn[0].parentElement).css('z-index', '1600')
    } else {
      clickedOn.css('z-index', '1600')

    }

  }

  judgement() {
    this.cardsShown = false
    this.helperText = this.room.czar + " is choosing the best card, you fools!"
    this.isJudging = true
    console.log('JUDGEMENT BEGINS!')
    

  }

  restartRound() {
    console.log('Check', this.room)
    if (this.room) {
      this.socket.emit('restartRound', this.room)

    }
  }

  confirmPopup(e):boolean {
    const popup = $('.confirm-popup')
    let toReturn = false
    !popup.hasClass('show') ? popup.addClass('show') : popup.removeClass('show')
    $('#yes').on('click', r => {
      toReturn = true
      popup.removeClass('show')
      $('#cancel').off();
      $('#yes').off();
      this.chooseWinner($(e.target.parentElement.parentElement)[0].firstElementChild.innerText.trim());
      // console.log(this.room.selectedCards)
    })
    $('#cancel').on('click', e => {
      popup.removeClass('show')
      $('#cancel').off();
      $('#yes').off();
      
    })
    return toReturn
  }

  chooseWinner(e) {
    // Find whose card was it
    console.log('WINNER SELECTED', e)
    console.log('CHECK', this.room.selectedCards)
    for (let plr in this.room.selectedCards) {
      console.log('Searching '+ e + ' for', plr,"'s cards in", this.room.selectedCards)
      if (this.room.selectedCards[plr][0].includes(e) || e == this.room.selectedCards[plr]) {
        console.log('Winner is', plr)
        this.socket.emit('winnerSelected', {winner: plr, room: this.room})
        return 
      } else {
        console.log('Winner not found...')
        
      }
    }
    
  }

  showMyCards() {
    if (this.cardsShown) {
      this.cardsShown = !this.cardsShown
      // hide cards
      $('.my-cards-button').removeClass('top')
      // $('.my-cards-button').toFront();
    } else {
      this.cardsShown = !this.cardsShown
      // show cards
      $('.my-cards-button').addClass('top')
      // $('.my-cards-button').toFront();
      

    }
  }
}
