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
      // console.log($(`div:contains(${this.selectedCards[0]})`))
    }
    // console.log('TEST MYCARDS', this.myCards)


    // console.log(room, myName)
  }

  findPlayerInPlayers(playerName) {
    
  }

  trySelecting(e) {
    const label = $(e.target)
    let isSelected = $(label[0].parentElement).hasClass('selected');
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
    

      if (isSelected) {
        but.removeClass('selected')
        but.removeClass('selectedMultiple')
        label[0].innerHTML = '+'
        console.log('SPLICING', this.selectedCards)
        this.selectedCards.splice(this.selectedCards.indexOf($(but[0].parentElement)[0].children[0].innerText), 1)
        console.log('SPLICED', this.selectedCards)
        for (let i = 0; i < this.selectedCards.length; i++) {
          let cardText = $('.white-card-text').toArray()[i].innerText
          $('.white-card-text').toArray().map(card => {
            if (card.innerText == this.selectedCards[i]) {
              console.log('Giving', i+1, 'to', card.innerText)
              console.log($($($($(card)[0].nextElementSibling)[0])[0].firstElementChild).text(i+1))
              $($($($(card)[0].nextElementSibling)[0])[0].firstElementChild).text(i+1)            }
          })
        }
        return true
      }
      
      //update numbers on cards

      // for (let i = 0; i < this.selectedCards.length; i++) {
      //   let cardText = $('.white-card-text').toArray()[i].innerText
      //   $('.white-card-text').toArray().map(card => {
      //     if (card.innerText == this.selectedCards[i]) {
      //       console.log('Giving', i+1, 'to', card.innerText)
      //       console.log($($(card)[0].nextElementSibling)[0])
      //       // $($($(card)[0].nextElementSibling)[0].firstChildrenElement)[0].text(i+1)
      //     }
      //   })
      // }


      if (this.selectedCards.length < this.room.black.pick ) {

        but.addClass('selected')
        but.addClass('selectedMultiple')
        label[0].innerHTML = this.selectedCards.length+1
        // this.selectedCards = []
        this.selectedCards.push($(but[0].parentElement)[0].children[0].innerText)
        // let player = this.findPlayerInPlayers(this.myName)['name'];
        // console.log('IS THIS MY NAME?', player)
        if (this.selectedCards.length == this.room.black.pick) {
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
        
      }  

    }
      console.log(this.selectedCards)
    
  }

}
