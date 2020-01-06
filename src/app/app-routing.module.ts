import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { EntryComponent } from './entry/entry.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  {path: "lobby/:id", component: LobbyComponent},
  {path: "game/:id", component: GameComponent},

  {path: "", pathMatch: 'full', component: EntryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
