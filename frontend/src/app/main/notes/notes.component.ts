import { Component, makeEnvironmentProviders, OnInit } from '@angular/core';
import { NOTES } from '../mock-notes';
import { Note } from '../note';
import * as marked from 'marked';


//declare const marked: any;
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  notes = NOTES;
  ngOnInit(){
    this.notes.forEach(elem => {
        (elem.content = marked.marked.parse(elem.content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")))
      console.log(elem.content)}
    );
    //Hier API Req für alle public notes
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
