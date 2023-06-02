import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'client';
    message: any;
    constructor(private apiService: ApiService) { };
    ngOnInit() {
        this.apiService.getMessage().subscribe(data => {
            this.message = data;
        });
    }
}
