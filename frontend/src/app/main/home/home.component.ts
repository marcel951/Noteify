import { Component, OnInit } from '@angular/core';
import { Note } from '../note';
import { ApiService } from 'src/app/services/api.service';
import * as marked from 'marked';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  notes : Note[] = [];
  constructor(
    private api: ApiService, 
    private app: AppComponent
  ) { }

  ngOnInit(){
    this.api.getTypeRequest("home/publicnotes").subscribe((res:any) => {
      this.notes = res.data;
      this.parse();
      this.app.update();
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
