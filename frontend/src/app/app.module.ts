import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth/auth.module';
import { RouterModule } from '@angular/router';
import { NotesComponent } from './main/notes/notes.component';
import { HomeComponent } from './main/home/home.component';
import { SingleNoteComponent } from './main/single-note/single-note.component';

@NgModule({
  declarations: [
    AppComponent,
    NotesComponent,
    HomeComponent,
    SingleNoteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
