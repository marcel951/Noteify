import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import {NOTES} from "../mock-notes";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchTerm: string = '';
  searchResults: any[]= []; // Ergebnisse der API-Suche

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.search();
    });
  }

  search() {
    this.apiService.getTypeRequest(`home/search?query=${this.searchTerm}`)
      .subscribe((results: any) => {
        this.searchResults = results;
        console.log(this.searchResults);
      });
  }

  navigateToSearch() {
    if (this.searchTerm) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
    }
  }

  protected readonly NOTES = NOTES;
}
