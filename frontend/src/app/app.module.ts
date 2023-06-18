import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth/auth.module';
import { RouterModule } from '@angular/router';
import { NotesComponent } from './main/notes/notes.component';
import { HomeComponent } from './main/home/home.component';
import { SingleNoteComponent } from './main/single-note/single-note.component';
import { NewNoteComponent } from './main/new-note/new-note.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateNoteComponent } from './main/update-note/update-note.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor-service.service';
import { SearchComponent } from './main/search/search.component';

import { YouTubePlayerModule } from '@angular/youtube-player';
import { VideoComponent } from './main/video/video.component';

@NgModule({
  declarations: [
    AppComponent,
    NotesComponent,
    HomeComponent,
    SingleNoteComponent,
    NewNoteComponent,
    UpdateNoteComponent,
    SearchComponent,
    VideoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    YouTubePlayerModule
  ],
  exports : [
    NewNoteComponent,
  ],
  providers: [
{   provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
