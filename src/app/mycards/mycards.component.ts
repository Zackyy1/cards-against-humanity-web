import { Component, OnInit, Input, Output } from '@angular/core';
import { info } from 'console';
import * as $ from 'jquery'
@Component({
  selector: 'app-mycards',
  templateUrl: './mycards.component.html',
  styleUrls: ['./mycards.component.scss']
})
export class MycardsComponent implements OnInit {

  
  @Input() cardsShown: boolean
  @Input() myCards: Array<any>
  @Input() currentCardInFrontIndex: number
  @Input() room
  @Input() selectedCards: Array<string>
  @Input() myName: string

  constructor() { 

  }

  ngOnInit() {
    console.log('Appeared')
    if (this.selectedCards.length > 0) {
      console.log($(`div:contains(${this.selectedCards[0]})`))
    }

    // console.log(room, myName)
  }

  trySelecting(e) {
    const label = $(e.target)
    const isSelected = $(label[0].parentElement).hasClass('selected');
    // const isSelected = false;
    const but = $(label[0].parentElement)

    // Clear all selection if gotta choose 1
    // Check FOR 1 WHEN ITS DONE


    if (but.hasClass('indicator')) {

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
        } else {
          but.addClass('selected')
          label[0].innerHTML = '✔'
          this.selectedCards = []
          this.selectedCards.push($(but[0].parentElement)[0].children[0].innerText)
          console.log('Selected card:', this.selectedCards)
        }
      }
    
    }

}
