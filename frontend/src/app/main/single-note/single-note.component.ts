import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import * as marked from 'marked';
import { NOTES } from '../mock-notes';


@Component({
  selector: 'app-single-note',
  templateUrl: './single-note.component.html',
  styleUrls: ['./single-note.component.css']
})
export class SingleNoteComponent implements OnInit{
  id  = 0;
  private res: any;
  notes = NOTES;
  author_id_user = -1;
  author_id_note = -2;
  data = localStorage.getItem("userData");
  constructor(
    private route: ActivatedRoute,
    private api: ApiService, 
    ) {}

  ngOnInit(){
    this.res = this.route.params.subscribe(para => {
      this.id = +para['id'];
      //this.notes[0] = NOTES[this.id-1];
    })
    if(this.data != null) {
      this.author_id_user = JSON.parse(this.data).user_id;
    }
    console.log(this.author_id_user)
    this.api.getTypeRequest("home/singlenote/"+this.id).subscribe((res:any) => {
      console.log(res);
      this.notes = res.data;
      console.log(res.data)
      this.author_id_note = res.data[0].user_id;
      console.log(this.author_id_note)
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
  deletNote(note_id : number){
    console.log("delete works"+note_id)
  }
}
