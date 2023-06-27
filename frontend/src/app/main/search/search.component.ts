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
  searchPrivate: boolean = false;
  searchPublic: boolean = true;
  searchterm: string ='';
  tmp : string|null ="";

  searchResults:any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private _auth: AuthService
  ) {}

  ngOnInit() {
    this.isUserLogin();
    this.searchResults = [];   
    this.route.queryParamMap
      .subscribe(params => {
          console.log(params); // { order: "popular" }
          this.tmp= params.get("searchterm");
          if(this.tmp == null)this.tmp = "";
          this.searchterm =this.tmp;
          this.searchPrivate = (params.get("searchPrivate") === "true");
          this.searchPublic= (params.get("searchPublic")==="true");
          this.search();
        }
      );
    console.log("Search übergabe private: "+this.searchPrivate);
  }
  isUserLogin(){
    if(this._auth.getUserDetails() != null){this.isLogin = true;
    }
  }

  search() {
    this.apiService.getTypeRequest(
      `home/search?searchterm=` +this.searchterm+
      '&searchPrivate=' +this.searchPrivate+
      '&searchPublic=' +this.searchPublic).subscribe((results:any) => {
        console.log("res"+results.data);
        const notes = Array.from(results.data);
        this.searchResults = notes;
        console.log("notes:"+notes);
      });
  }


navigateToSearch() {
  if(!this.isLogin){
    this.searchPublic = true;
  }
    this.router.navigate(['/search'],
      { queryParams: {
          searchterm: this.searchterm,
          searchPrivate: this.searchPrivate,
          searchPublic: this.searchPublic
          }
      }
    );
  }
}
