import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as $ from 'jquery'
import { Router } from '@angular/router';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  roomCodeString:string = '____'
  roomCode: string = ''
  
  constructor(
    private socket: Socket,
    private router: Router
    ) {
    // socket.emit('hello')
  }
  ngOnInit() {
    $('td').click(e=> {
      let pressed = e.target.innerHTML
      this.changeCode(pressed)
    })
    
  }

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
      this.tryJoin()
    }
  }

  tryJoin() {
    this.socket.emit('join', {code: this.roomCode, name: $('#name')[0].value})
    this.socket.once('joinResponse', (e) => {
      console.log('returned', e)
      if (e.code == 'SUCCESS') {
        console.log('Success')
        this.router.navigateByUrl('lobby/'+e.roomCode)
      } else if (e.code == 'ERROR') {
        console.error(e.body)

      }
    })
  }

   getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  createRoom() {
    const newRoomCode = this.getRandomInt(1000, 9999)
    this.socket.emit('createRoom', {roomCode: newRoomCode, name: $('#name')[0].value})
    this.socket.once('joinCreatedRoom', (e) => {
      
      this.router.navigateByUrl('/lobby/'+e.roomCode)
    })
  }


}
