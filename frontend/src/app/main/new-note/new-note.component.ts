import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-new-note',
  templateUrl: './new-note.component.html',
  styleUrls: ['./new-note.component.css']
})
export class NewNoteComponent implements OnInit{
  constructor(
    private api : ApiService,
  ){}
  ngOnInit(): void {
      
  }
  onSubmit(form: NgForm) {
    console.log(form.value);
    this.api.postTypeRequest('home/new', form.value).subscribe((res: any) => {
    });
  } 
}
