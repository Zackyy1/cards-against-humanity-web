import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LobbyComponent } from './lobby/lobby.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { EntryComponent } from './entry/entry.component';
// var config: SocketIoConfig = { url: 'http://90.190.166.179:4444', options: {} };
var config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
