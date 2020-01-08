import { Component, OnInit, Input } from '@angular/core';
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

  constructor() { }

  ngOnInit() {
    $('.white-card-wrapper').click(e=> {
      console.log(e.target)
    })
  }

}
