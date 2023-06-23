import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  isLogin: boolean = false;
  searchTitle: string | null ='';
  searchContent: string | null ='';
  searchAuthor: string | null ='';
  searchPrivate: boolean | null = false;
  searchPublic: boolean | null = false;

  searchObj: any;

  searchResults:any = [];

  // Ergebnisse der API-Suche

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParamMap
      .subscribe(params => {
          console.log(params); // { order: "popular" }
          this.searchTitle = params.get("title");
          this.searchContent= params.get("content");
          this.searchAuthor= params.get("author");
          this.searchPrivate = params.get("searchPrivate")=="true";
          this.searchPublic= params.get("searchPublic")=="true";
        }
      );
    this.search();
  }
  isUserLogin(){
    if(this._auth.getUserDetails() != null){this.isLogin = true;
    }
  }

  search() {
    console.log("Debug:API"+`home/search?titel=`+this.searchTitle+'&content='+this.searchContent+'&author='+this.searchAuthor+'&searchPrivate='+this.searchPrivate+'&searchPublic='+this.searchPublic);

    this.apiService.getTypeRequest(`home/search?titel=`
      +this.searchObj.title+'&content='
      +this.searchObj.content+'&author='
      +this.searchObj.author +'&searchPrivate='
      +this.searchObj.searchPrivate+'&searchPublic='
      +this.searchObj.searchPublic).subscribe((results:any) => {
        const notes = Array.from(results.data);
        this.searchResults = notes;
        console.log(notes);
      });
  }


navigateToSearch() {
    this.router.navigate(['/search'],
      { queryParams: {
          title: this.searchTitle,
          content: this.searchContent,
          author: this.searchAuthor,
          privateNotes: this.searchPrivate,
          publicNotes: this.searchPublic
          }
      }
    );
    this.search();
  }
}
