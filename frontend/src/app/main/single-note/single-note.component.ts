import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import * as marked from 'marked';
import { AppComponent } from 'src/app/app.component';
import { DomSanitizer } from '@angular/platform-browser';
import { Note } from '../note';

@Component({
  selector: 'app-single-note',
  templateUrl: './single-note.component.html',
  styleUrls: ['./single-note.component.css']
})
export class SingleNoteComponent implements OnInit{
  id  = 0;
  private res: any;
  notes : Note[] = [];
  author_id_user = -1;
  author_id_note = -2;
  data = localStorage.getItem("userData");
  constructor(
    private route: ActivatedRoute,
    private api: ApiService, 
    private router : Router,
    private logout: AppComponent,
    private sanitized: DomSanitizer
    ) {}

  ngOnInit(){
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);


    this.res = this.route.params.subscribe(para => {
      this.id = para['id'];
    })
    if(this.data != null) {
      this.author_id_user = JSON.parse(this.data).user_id;
    }
    this.api.getTypeRequest("home/singlenote/"+this.id).subscribe((res:any) => {
      if (res.message === 'Token expired') {
        this.logout.logout("login");
      }else{
        this.notes = res.data;
        this.author_id_note = res.data[0].user_id;
        this.parse();
      }
    });
  }
  parse(){
    this.notes.forEach(elem => {
      let regex = new RegExp(/(https:\/\/www\.youtube\.com\/[^\s]*)|(https:\/\/youtu\.be\/[^\s]*)/, "i");

      let youtubeid = this.youtube_parser(elem.youtube);
      
  
      (elem.content = marked.marked.parse(elem.content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")))
        elem.created = new Date(elem.created).toLocaleString("en-GB", {timeZone: 'Europe/Berlin'})
        elem.lastChanged = new Date(elem.lastChanged).toLocaleString("en-GB", {timeZone: 'Europe/Berlin'})
        elem.youtube=youtubeid;
    });
  }

  youtube_parser(url:any){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : "";
  }

  idToPlayer(id:string):string{
    var res = `<youtube-player videoId="${id}" suggestedQuality="highres" [height]="250" [width]="500" [startSeconds]="4"[endSeconds]="8"></youtube-player>`;
    return res;
  }

   deletNote(){
    this.api.deleteTypeRequest("home/singlenote/"+this.id).subscribe((res:any) => {
    });
    this.router.navigate([""]);
  }
}
