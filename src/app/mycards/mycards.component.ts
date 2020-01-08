import { Component, OnInit, Input, Output } from '@angular/core';
import * as $ from 'jquery'
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-mycards',
  templateUrl: './mycards.component.html',
  styleUrls: ['./mycards.component.scss']
})
export class MycardsComponent implements OnInit {

  
  @Input() cardsShown: boolean
  @Input() myCards
  @Input() currentCardInFrontIndex: number
  @Input() room
  @Input() selectedCards: Array<string>
  @Input() myName: string

  constructor(private socket: Socket) { 
  }

  ngOnInit() {
    console.log('Appeared')
    if (this.selectedCards.length > 0) {
      console.log($(`div:contains(${this.selectedCards[0]})`))
    }
    console.log('TEST MYCARDS', this.myCards)


    // console.log(room, myName)
  }

  findPlayerInPlayers(playerName) {
    
  }

  trySelecting(e) {
    const label = $(e.target)
    const isSelected = $(label[0].parentElement).hasClass('selected');
    // const isSelected = false;
    const but = $(label[0].parentElement)

    // CHOOSE 1

    if (but.hasClass('indicator') && this.room.black.pick == 1) {

        if ($('.indicator').hasClass('selected')) {
          $('.indicator').removeClass('selected')
        }
        // console.log($('.indicatorLabel'))
        $('.indicatorLabel').toArray().map(e=>{
          e.innerHTML = "+"
        })
    
        if (isSelected) {
          but.removeClass('selected')
          label[0].innerHTML = '+'
          this.selectedCards = []

        } else {
          but.addClass('selected')
          label[0].innerHTML = '✔'
          this.selectedCards = []
          this.selectedCards.push($(but[0].parentElement)[0].children[0].innerText)
          // let player = this.findPlayerInPlayers(this.myName)['name'];
          // console.log('IS THIS MY NAME?', player)
          this.room.players.map(plr => {
            if (plr.name == this.myName) {
              this.socket.emit('cardSelected', 
            {
              room: this.room, 
              player: plr, 
              cards: this.selectedCards}
            )
            
            }
          })
        }  
    } else if (but.hasClass('indicator') && this.room.black.pick > 1) {
      // Deal with pick 2-3 here
    }
    
  }

}
