//Src: https://medium.com/geekculture/how-to-build-a-simple-login-in-angular-express-mysql-2c98cad532fd
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable(
  { providedIn: 'root' }) export class ApiService {
    baseUrl = 'https://localhost:4000/';
  constructor(private _http: HttpClient) {

  }
  getTypeRequest(url: any) {
    return this._http.get(`${this.baseUrl}${url}`).pipe(map(res => { return res; })); }
  postTypeRequest(url: any, payload: any) {
     return this._http.post(`${this.baseUrl}${url}`, payload).pipe(map(res => { return res; })); }
  putTypeRequest(url: any, payload: any) {
    return this._http.put(`${this.baseUrl}${url}`, payload).pipe(map(res => {
      return res;
    }))
      ;
  }
  deleteTypeRequest(url: any){
    return this._http.delete(`${this.baseUrl}${url}`).pipe(map(res => { return res; }));
  }
}
