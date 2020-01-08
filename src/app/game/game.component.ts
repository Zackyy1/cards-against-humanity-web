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
  myCards: Array<any> = [
    'Having to poop so bad you shit yourself.',
    'Hannah Montana.',
    'Whatever you wish, mother.',
    'Snorting coke, banging hookers and having a good time overall.',
]
  currentCardInFrontIndex = 1

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
    window.scrollTo(0, 0)
    this.socket.emit('requestUpdate', this.roomCode.toString())
    this.socket.on('roomUpdate'+this.roomCode.toString(), room => {
      console.log('Update recieved:', room)
      this.room = room
    })

    $('.my-cards-button').click( e => {
      this.showMyCards();
    })

    $('div#mainCard.white-card').click(e => {
      console.log(e.target)
    })

    



  }

  test() {
    console.log("TEST WORKED")
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

  /**
   * 
   * Todo: 
   * czar functionality, card selections, db connections
   */


}
