import { Component, OnInit } from '@angular/core';
import { NgForm, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NOTES } from '../mock-notes';
import { Note } from '../note';
import { FormGroup, FormControl } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.component.html',
  styleUrls: ['./update-note.component.css']
})
export class UpdateNoteComponent implements OnInit{
  constructor(
    private api : ApiService,
    private route : ActivatedRoute,
    private router: Router,
    private logout : AppComponent
  ){}
  private res: any;
  private id = 0;
  note = NOTES[0];
  updateForm = new FormGroup({
    titel: new FormControl(''),
    content: new FormControl(''),
    youtube: new FormControl(''),
    isPrivate: new UntypedFormControl,
  })
  ngOnInit(){
    this.res = this.route.params.subscribe(para => {
      this.id = para['id'];
    })
    this.note = NOTES[this.id-1];
    this.api.getTypeRequest('home/singlenote/'+this.id).subscribe((res:any) => {
      this.note = res.data[0];
      console.log(this.note);
      this.updateThisForm();
    });

   
  }
  updateThisForm(){
       this.updateForm.setValue({
      titel: this.note.titel,
      content: this.note.content,
      youtube: this.note.youtube,
      isPrivate: this.note.isPrivate
   })
  }
  onSubmit() {
    console.log(this.updateForm.value);
    this.api.postTypeRequest('home/update/'+this.id, this.updateForm.value).subscribe((res: any) => {
      if (res.message === 'Token expired') {
        this.logout.logout('login');
      }
    });
    this.router.navigate(["notes"])
  } 
}
