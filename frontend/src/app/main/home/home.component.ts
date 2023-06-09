import { Component, OnInit } from '@angular/core';
import { NOTES } from '../mock-notes';
import { Note } from '../note';
import { ApiService } from 'src/app/services/api.service';
import * as marked from 'marked';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  notes = NOTES;
  constructor(
    private api: ApiService, 
  ) { }

  ngOnInit(){
    this.api.getTypeRequest("home/publicnotes").subscribe((res:any) => {
      console.log(res);
      this.notes = res.data;
    });
    this.notes.forEach(elem => {
        (elem.content = marked.marked.parse(elem.content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")))
    });
  }
} 
