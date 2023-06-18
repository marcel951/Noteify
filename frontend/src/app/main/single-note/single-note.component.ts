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
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);


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
      let regex = new RegExp(/(https:\/\/www\.youtube\.com\/[^\s]*)|(https:\/\/youtu\.be\/[^\s]*)/, "i");

      console.log('youtube Video:');
      //console.log(regex.test(elem.content));
      //console.log(regex.exec(elem.content));

      //console.log(this.youtube_parser("https://www.youtube.com/watch?v=JepMpjhkt-4"));

      let links = elem.content.match(/(https:\/\/www\.youtube\.com\/[^\s]*)|(https:\/\/youtu\.be\/[^\s]*)/g);
      let ids = new Array<string>();
      let i = 0;
      if(links != null){
        links.forEach( (value) => {
          ids[i] = this.youtube_parser(value);
          i++;
        }); 
        i = 0;
        links.forEach( (value) => {
          elem.content = elem.content.split(value).join(this.linkToPlayer(ids[i]));
          i++;
        }); 
      }
      console.log(links);
      console.log(ids);
  
      (elem.content = marked.marked.parse(elem.content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")))
        elem.created = new Date(elem.created).toLocaleString("en-GB", {timeZone: 'Europe/Berlin'})
        elem.lastChanged = new Date(elem.lastChanged).toLocaleString("en-GB", {timeZone: 'Europe/Berlin'})
    });
  }

  youtube_parser(url:any){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  linkToPlayer(id:string):string{
    var res = `<youtube-player videoId="${id}" suggestedQuality="highres" [height]="250" [width]="500" [startSeconds]="4"[endSeconds]="8"></youtube-player>`;
    return res;
  }
   deletNote(note_id : number){
    console.log("delete works"+note_id)
  }

}
