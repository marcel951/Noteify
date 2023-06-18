import { Component, makeEnvironmentProviders, OnInit } from '@angular/core';
import { NOTES } from '../mock-notes';
import { Note } from '../note';
import * as marked from 'marked';
import { ApiService } from 'src/app/services/api.service';


//declare const marked: any;
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  constructor(
    private api : ApiService,
  ){}
  notes = NOTES;
  ngOnInit(){
    //Hier API Req für alle public notes
    this.api.getTypeRequest("home/usernotes").subscribe((res:any) => {
      //console.log(res);
      this.notes = res.data;
      this.parse();
    });
    
  }
  parse(){
      this.notes.forEach(elem => {
        (elem.content = marked.marked.parse(elem.content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")))
        elem.created = new Date(elem.created).toLocaleString("en-GB", {timeZone: 'Europe/Berlin'})
        elem.lastChanged = new Date(elem.lastChanged).toLocaleString("en-GB", {timeZone: 'Europe/Berlin'})
    });
  }
  

  //Potenziell in eigenen Service auslagern 
  //Nur möglich falls logged in
  updateNote(note_id : number){
    console.log("update works"+note_id)
  }
  deletNote(note_id : number){
    console.log("delete works"+note_id)
  }


}
