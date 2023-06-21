import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  isLogin: boolean = false
  constructor(
    private _auth: AuthService,
    private _router: Router
  ){}
  ngOnInit(){
    this.isUserLogin();
  }
  isUserLogin(){
    if(this._auth.getUserDetails() != null){this.isLogin = true;
  }}
  update(){
    this.isUserLogin();
  }
  logout(route:string){
  this._auth.clearStorage()
  this._router.navigate([route]);
  this.isLogin = false;
  }
}
