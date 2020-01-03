import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import * as $ from 'jquery'
import { Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  roomCode:number
  room: Object


  constructor(private socket: Socket) {
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
    })
  }

  getServerInfo() {
    this.socket.emit('getInfo', this.roomCode.toString())
  }

  setReady() {
    // TODO:
  }

}
