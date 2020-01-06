import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as $ from 'jquery'
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  roomCode:number
  room
  myName:string

  constructor(private socket: Socket,
    private cookie: CookieService,
    private router: Router) {
    this.myName = cookie.get('name')
    console.log('My name is', this.myName)

    const url = document.URL
    this.roomCode = Number(url.substring(url.search('lobby/')+'lobby/'.length, url.length))
    console.log('RECIEVING', 'roomUpdate'+this.roomCode.toString())
    

   }

   
  ngOnInit() {
    
    window.scrollTo(0, 0)
    this.socket.emit('requestUpdate', this.roomCode.toString())
    this.socket.on('roomUpdate'+this.roomCode.toString(), room => {
      console.log('Update recieved:', room)
      this.room = room
      if (room['gameStatus'] && room['gameStatus'] == 'game') {
        this.router.navigateByUrl('game/'+this.roomCode)
      }
    })
  }

  getServerInfo() {
    this.socket.emit('getInfo', this.roomCode.toString())
  }

  setReady() {
    // TODO:
    this.socket.emit('ready', {roomCode:this.roomCode, name: this.myName})
  }

}
