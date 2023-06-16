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

  constructor(
    private route: ActivatedRoute,
    private api: ApiService, 
    ) {}

  ngOnInit(){
    this.res = this.route.params.subscribe(para => {
      this.id = +para['id'];
    })

    console.log("test singleNote"+this.id);

    this.api.getTypeRequest("home/singlenote/"+this.id).subscribe((res:any) => {
      console.log(res);
      this.notes = res.data;
    });
    this.notes.forEach(elem => {
        (elem.content = marked.marked.parse(elem.content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")))
    });
  }

}
