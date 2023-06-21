import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import {NOTES} from "../mock-notes";
import {AuthService} from "../../services/auth.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  isLogin: boolean = false;
  searchTitle: string ='';
  searchContent: string ='';
  searchAuthor: string ='';
  searchPrivate: string ='';
  searchPublic: string ='';


  // Ergebnisse der API-Suche
  searchResults: any[]= [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.search();
    });
    this.isUserLogin();
  }

  isUserLogin(){
    if(this._auth.getUserDetails() != null){this.isLogin = true;
    }}
  search() {
    this.apiService.getTypeRequest(`home/search?query=${this.searchTerm}`)
      .subscribe((results:any) => {
        if (typeof results === "string") {
           JSON.parse(results);
        }

        //this.searchResults += results;
        //console.log(this.searchResults);
      });
  }

  navigateToSearch() {
    this.searchTerm = this.searchTitle + "|" + this.searchContent + "|" + this.searchAuthor + "|" + this.searchPrivate + "|" + this.searchPublic;
    if (this.searchTerm) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
    }
    this.search();
  }

  protected readonly Title = Title;
}
