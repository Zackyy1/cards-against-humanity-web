import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
import { isNumber } from 'util';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cards-against-humanity';

  roomCodeString:string = '____'
  roomCode: string = ''

  changeCode(num) {
    if (this.roomCode.length > 3 && !(num.toString() == "&lt;")) {
    } else {
      if (Number(num) == 0) {
        this.roomCode += num

      }
      if (Number(num)) {
        this.roomCode += num
      } else if (num.toString() == "&lt;") {
        if (this.roomCode.length > 0) {
          this.roomCode = this.roomCode.substr(0, this.roomCode.length-1)
        }
      }
      this.roomCodeString = this.roomCode
      if (this.roomCode.length < 4) {
        this.roomCodeString += '_'
        if (this.roomCode.length < 3) {
          this.roomCodeString += '_'
        }
        if (this.roomCode.length < 2) {
          this.roomCodeString += '_'
        }
        if (this.roomCode.length < 1) {
          this.roomCodeString += '_'
        }
      }
    }

    if (num == "GO") {

      console.log('Trying to join room', this.roomCode)
    }
  }

  ngOnInit() {
    $('td').click(e=> {
      let pressed = e.target.innerHTML
      this.changeCode(pressed)

    })
  }
  
}
