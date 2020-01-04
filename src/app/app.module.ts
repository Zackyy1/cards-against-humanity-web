import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { EntryComponent } from './entry/entry.component';
import { CookieService } from 'ngx-cookie-service'
import { environment } from 'src/environments/environment';
// import * as fs from 'fs'

const env_url = environment.url
console.log('Listening on', env_url)

var config: SocketIoConfig = { url: env_url, 
  options: {
    transports: ['websocket'],
    rejectUnauthorized: false,
    secure: false,
    
  } 
};
// var config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    EntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)

  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
