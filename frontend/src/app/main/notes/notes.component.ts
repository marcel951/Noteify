import { Component, makeEnvironmentProviders, OnInit } from '@angular/core';
import { Note } from '../note';
import * as marked from 'marked';
import { ApiService } from 'src/app/services/api.service';
import { AppComponent } from 'src/app/app.component';


//declare const marked: any;
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  constructor(
    private api : ApiService,
    private logout : AppComponent,
  ){}
  notes : Note[] = [];
  ngOnInit(){
    this.api.getTypeRequest("home/usernotes").subscribe((res:any) => {
      if (res.message === 'Token expired') {
        this.logout.logout("login");
      }else{
        this.notes = res.data;
        this.parse();        
      }

    });
    
  }
  parse(){
      this.notes.forEach(elem => {
        (elem.content = marked.marked.parse(elem.content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")))
        elem.created = new Date(elem.created).toLocaleString("en-GB", {timeZone: 'Europe/Berlin'})
        elem.lastChanged = new Date(elem.lastChanged).toLocaleString("en-GB", {timeZone: 'Europe/Berlin'})
    });
  }
}
